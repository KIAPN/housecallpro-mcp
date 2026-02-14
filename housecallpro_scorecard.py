#!/usr/bin/env python3
"""
Housecall Pro EOS Scorecard MCP Server

This server provides EOS L10 meeting scorecard metrics for Housecall Pro,
including weekly revenue, pipeline value, close rate, and scheduled jobs.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List

import httpx
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

# Load environment variables
load_dotenv()

# FastMCP server
mcp = FastMCP("Housecall Pro Scorecard")

# Configuration
API_KEY = os.getenv("HOUSECALL_PRO_API_KEY")
API_BASE_URL = "https://api.housecallpro.com"

if not API_KEY:
    raise ValueError("HOUSECALL_PRO_API_KEY environment variable is required")


def get_headers() -> Dict[str, str]:
    """Get headers for API requests."""
    return {
        "Authorization": f"Token {API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }


def format_hcp_date(dt: datetime) -> str:
    """
    Format datetime for HouseCall Pro API.
    HCP expects: YYYY-MM-DDTHH:MM:SS (no microseconds, no timezone suffix)
    """
    return dt.replace(microsecond=0).strftime('%Y-%m-%dT%H:%M:%S')


async def make_api_request(endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
    """Make a GET request to Housecall Pro API."""
    url = f"{API_BASE_URL}{endpoint}"
    headers = get_headers()

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params or {}, timeout=30.0)
        response.raise_for_status()
        return response.json()


# ============== REPORTING TOOLS ==============

@mcp.tool()
async def get_weekly_revenue(weeks_back: int = 1) -> Dict[str, Any]:
    """
    Get revenue from completed jobs for the specified week.

    Args:
        weeks_back: Number of weeks back (0 = current week, 1 = last week, etc.)

    Returns:
        Total revenue, job count, and job details for the week
    """
    today = datetime.now()
    # Calculate week boundaries (Monday to Sunday)
    start_of_this_week = today - timedelta(days=today.weekday())
    start_of_target_week = start_of_this_week - timedelta(weeks=weeks_back)
    end_of_target_week = start_of_target_week + timedelta(days=6, hours=23, minutes=59, seconds=59)

    jobs_data = await make_api_request("/jobs", {
        "page_size": 200,
        "work_status": "complete",
        "completed_at_min": format_hcp_date(start_of_target_week),
        "completed_at_max": format_hcp_date(end_of_target_week)
    })

    jobs = jobs_data.get("jobs", [])
    total_revenue = sum(float(job.get("total_amount", 0) or 0) for job in jobs)

    return {
        "week_start": start_of_target_week.strftime("%Y-%m-%d"),
        "week_end": end_of_target_week.strftime("%Y-%m-%d"),
        "total_revenue": total_revenue,
        "job_count": len(jobs),
        "jobs": jobs
    }


@mcp.tool()
async def get_pipeline_value() -> Dict[str, Any]:
    """
    Get the current sales pipeline - all pending estimates.

    Returns:
        Total pipeline value, estimate count, and estimate details
    """
    estimates_data = await make_api_request("/estimates", {
        "page_size": 200,
        "status": "pending"
    })

    estimates = estimates_data.get("estimates", [])
    total_value = sum(float(est.get("total_amount", 0) or 0) for est in estimates)

    return {
        "total_pipeline_value": total_value,
        "estimate_count": len(estimates),
        "estimates": estimates
    }


@mcp.tool()
async def get_close_rate(days_back: int = 30) -> Dict[str, Any]:
    """
    Calculate close rate (won estimates / total decided estimates) for a period.

    Args:
        days_back: Number of days to look back (default 30)

    Returns:
        Close rate percentage, won/lost counts and values
    """
    start_date = format_hcp_date(datetime.now() - timedelta(days=days_back))

    # Get won estimates
    won_data = await make_api_request("/estimates", {
        "page_size": 200,
        "status": "won",
        "created_at_min": start_date
    })

    # Get lost estimates
    lost_data = await make_api_request("/estimates", {
        "page_size": 200,
        "status": "lost",
        "created_at_min": start_date
    })

    won = won_data.get("estimates", [])
    lost = lost_data.get("estimates", [])

    total_decided = len(won) + len(lost)
    close_rate = (len(won) / total_decided * 100) if total_decided > 0 else 0

    won_value = sum(float(est.get("total_amount", 0) or 0) for est in won)
    lost_value = sum(float(est.get("total_amount", 0) or 0) for est in lost)

    return {
        "period_days": days_back,
        "close_rate_percent": round(close_rate, 1),
        "won_count": len(won),
        "lost_count": len(lost),
        "won_value": won_value,
        "lost_value": lost_value,
        "total_decided": total_decided
    }


@mcp.tool()
async def get_scheduled_jobs(days_forward: int = 14) -> Dict[str, Any]:
    """
    Get jobs scheduled for the upcoming period.

    Args:
        days_forward: Number of days to look ahead (default 14)

    Returns:
        Scheduled jobs with total value and details
    """
    start_date = format_hcp_date(datetime.now())
    end_date = format_hcp_date(datetime.now() + timedelta(days=days_forward))

    jobs_data = await make_api_request("/jobs", {
        "page_size": 200,
        "work_status": "scheduled",
        "scheduled_start_min": start_date,
        "scheduled_start_max": end_date
    })

    jobs = jobs_data.get("jobs", [])
    total_value = sum(float(job.get("total_amount", 0) or 0) for job in jobs)

    return {
        "period_days": days_forward,
        "total_scheduled_value": total_value,
        "job_count": len(jobs),
        "jobs": jobs
    }


@mcp.tool()
async def get_scorecard_metrics() -> Dict[str, Any]:
    """
    Get all key metrics for the EOS Scorecard in one call.
    Perfect for L10 meetings.

    Returns:
        Dictionary with all scorecard metrics:
        - This week's completed revenue
        - Last week's completed revenue
        - Pipeline value (pending estimates)
        - 30-day close rate
        - Scheduled jobs (next 14 days)
    """
    # Get this week's revenue
    this_week = await get_weekly_revenue(weeks_back=0)

    # Get last week's revenue
    last_week = await get_weekly_revenue(weeks_back=1)

    # Get pipeline
    pipeline = await get_pipeline_value()

    # Get close rate
    close_rate = await get_close_rate(days_back=30)

    # Get scheduled jobs
    scheduled = await get_scheduled_jobs(days_forward=14)

    return {
        "generated_at": datetime.now().isoformat(),
        "this_week_revenue": this_week["total_revenue"],
        "this_week_jobs": this_week["job_count"],
        "last_week_revenue": last_week["total_revenue"],
        "last_week_jobs": last_week["job_count"],
        "pipeline_value": pipeline["total_pipeline_value"],
        "pipeline_count": pipeline["estimate_count"],
        "close_rate_30d": close_rate["close_rate_percent"],
        "won_30d": close_rate["won_count"],
        "lost_30d": close_rate["lost_count"],
        "scheduled_value_14d": scheduled["total_scheduled_value"],
        "scheduled_jobs_14d": scheduled["job_count"]
    }


if __name__ == "__main__":
    mcp.run()
