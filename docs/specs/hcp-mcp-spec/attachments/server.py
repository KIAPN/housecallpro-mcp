"""
HouseCall Pro MCP Server
Provides tools for querying HouseCall Pro API data
"""

import os
import httpx
from datetime import datetime, timedelta
from typing import Optional
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("housecallpro")

# Configuration
API_BASE_URL = "https://api.housecallpro.com/v1"
API_KEY = os.environ.get("HOUSECALLPRO_API_KEY", "")


def get_headers():
    """Get authorization headers for API requests"""
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }


async def api_request(endpoint: str, params: dict = None) -> dict:
    """Make an authenticated request to HouseCall Pro API"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/{endpoint}",
            headers=get_headers(),
            params=params or {},
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()


# ============== CUSTOMER TOOLS ==============

@mcp.tool()
async def get_customers(
    page: int = 1,
    page_size: int = 20,
    q: Optional[str] = None
) -> dict:
    """
    Get a list of customers from HouseCall Pro.
    
    Args:
        page: Page number (default 1)
        page_size: Results per page (default 20, max 200)
        q: Search query to filter customers by name, email, or phone
    
    Returns:
        List of customers with contact info
    """
    params = {"page": page, "page_size": page_size}
    if q:
        params["q"] = q
    return await api_request("customers", params)


@mcp.tool()
async def get_customer(customer_id: str) -> dict:
    """
    Get details for a specific customer.
    
    Args:
        customer_id: The HouseCall Pro customer ID
    
    Returns:
        Customer details including addresses, contact info
    """
    return await api_request(f"customers/{customer_id}")


# ============== ESTIMATE TOOLS ==============

@mcp.tool()
async def get_estimates(
    page: int = 1,
    page_size: int = 50,
    status: Optional[str] = None,
    scheduled_start_min: Optional[str] = None,
    scheduled_start_max: Optional[str] = None,
    created_at_min: Optional[str] = None,
    created_at_max: Optional[str] = None
) -> dict:
    """
    Get estimates from HouseCall Pro.
    
    Args:
        page: Page number (default 1)
        page_size: Results per page (default 50, max 200)
        status: Filter by status - 'pending', 'won', 'lost', 'expired'
        scheduled_start_min: ISO datetime - estimates scheduled after this time
        scheduled_start_max: ISO datetime - estimates scheduled before this time
        created_at_min: ISO datetime - estimates created after this time
        created_at_max: ISO datetime - estimates created before this time
    
    Returns:
        List of estimates with amounts, status, customer info
    """
    params = {"page": page, "page_size": page_size}
    if status:
        params["status"] = status
    if scheduled_start_min:
        params["scheduled_start_min"] = scheduled_start_min
    if scheduled_start_max:
        params["scheduled_start_max"] = scheduled_start_max
    if created_at_min:
        params["created_at_min"] = created_at_min
    if created_at_max:
        params["created_at_max"] = created_at_max
    return await api_request("estimates", params)


@mcp.tool()
async def get_estimate(estimate_id: str) -> dict:
    """
    Get details for a specific estimate.
    
    Args:
        estimate_id: The HouseCall Pro estimate ID
    
    Returns:
        Estimate details including line items, amounts, status
    """
    return await api_request(f"estimates/{estimate_id}")


# ============== JOB TOOLS ==============

@mcp.tool()
async def get_jobs(
    page: int = 1,
    page_size: int = 50,
    work_status: Optional[str] = None,
    scheduled_start_min: Optional[str] = None,
    scheduled_start_max: Optional[str] = None,
    completed_at_min: Optional[str] = None,
    completed_at_max: Optional[str] = None
) -> dict:
    """
    Get jobs from HouseCall Pro.
    
    Args:
        page: Page number (default 1)
        page_size: Results per page (default 50, max 200)
        work_status: Filter by status - 'scheduled', 'in_progress', 'complete', 'canceled'
        scheduled_start_min: ISO datetime - jobs scheduled after this time
        scheduled_start_max: ISO datetime - jobs scheduled before this time
        completed_at_min: ISO datetime - jobs completed after this time
        completed_at_max: ISO datetime - jobs completed before this time
    
    Returns:
        List of jobs with revenue, status, scheduled times
    """
    params = {"page": page, "page_size": page_size}
    if work_status:
        params["work_status"] = work_status
    if scheduled_start_min:
        params["scheduled_start_min"] = scheduled_start_min
    if scheduled_start_max:
        params["scheduled_start_max"] = scheduled_start_max
    if completed_at_min:
        params["completed_at_min"] = completed_at_min
    if completed_at_max:
        params["completed_at_max"] = completed_at_max
    return await api_request("jobs", params)


@mcp.tool()
async def get_job(job_id: str) -> dict:
    """
    Get details for a specific job.
    
    Args:
        job_id: The HouseCall Pro job ID
    
    Returns:
        Job details including line items, amounts, status, assigned employees
    """
    return await api_request(f"jobs/{job_id}")


# ============== EMPLOYEE TOOLS ==============

@mcp.tool()
async def get_employees(
    page: int = 1,
    page_size: int = 50
) -> dict:
    """
    Get employees from HouseCall Pro.
    
    Args:
        page: Page number (default 1)
        page_size: Results per page (default 50)
    
    Returns:
        List of employees with roles and contact info
    """
    params = {"page": page, "page_size": page_size}
    return await api_request("employees", params)


@mcp.tool()
async def get_employee(employee_id: str) -> dict:
    """
    Get details for a specific employee.
    
    Args:
        employee_id: The HouseCall Pro employee ID
    
    Returns:
        Employee details
    """
    return await api_request(f"employees/{employee_id}")


# ============== INVOICE TOOLS ==============

@mcp.tool()
async def get_invoices(
    page: int = 1,
    page_size: int = 50,
    status: Optional[str] = None,
    created_at_min: Optional[str] = None,
    created_at_max: Optional[str] = None
) -> dict:
    """
    Get invoices from HouseCall Pro.
    
    Args:
        page: Page number (default 1)
        page_size: Results per page (default 50, max 200)
        status: Filter by status - 'draft', 'sent', 'paid', 'partial', 'void'
        created_at_min: ISO datetime - invoices created after this time
        created_at_max: ISO datetime - invoices created before this time
    
    Returns:
        List of invoices with amounts, status, customer info
    """
    params = {"page": page, "page_size": page_size}
    if status:
        params["status"] = status
    if created_at_min:
        params["created_at_min"] = created_at_min
    if created_at_max:
        params["created_at_max"] = created_at_max
    return await api_request("invoices", params)


# ============== COMPOUND/REPORTING TOOLS ==============

@mcp.tool()
async def get_weekly_revenue(weeks_back: int = 1) -> dict:
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
    
    jobs_data = await api_request("jobs", {
        "page_size": 200,
        "work_status": "complete",
        "completed_at_min": start_of_target_week.isoformat(),
        "completed_at_max": end_of_target_week.isoformat()
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
async def get_pipeline_value() -> dict:
    """
    Get the current sales pipeline - all pending estimates.
    
    Returns:
        Total pipeline value, estimate count, and estimate details
    """
    estimates_data = await api_request("estimates", {
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
async def get_close_rate(days_back: int = 30) -> dict:
    """
    Calculate close rate (won estimates / total decided estimates) for a period.
    
    Args:
        days_back: Number of days to look back (default 30)
    
    Returns:
        Close rate percentage, won/lost counts and values
    """
    start_date = (datetime.now() - timedelta(days=days_back)).isoformat()
    
    # Get won estimates
    won_data = await api_request("estimates", {
        "page_size": 200,
        "status": "won",
        "created_at_min": start_date
    })
    
    # Get lost estimates
    lost_data = await api_request("estimates", {
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
async def get_scheduled_jobs(days_forward: int = 14) -> dict:
    """
    Get jobs scheduled for the upcoming period.
    
    Args:
        days_forward: Number of days to look ahead (default 14)
    
    Returns:
        Scheduled jobs with total value and details
    """
    start_date = datetime.now().isoformat()
    end_date = (datetime.now() + timedelta(days=days_forward)).isoformat()
    
    jobs_data = await api_request("jobs", {
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
async def get_scorecard_metrics() -> dict:
    """
    Get all key metrics for the EOS Scorecard in one call.
    
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
