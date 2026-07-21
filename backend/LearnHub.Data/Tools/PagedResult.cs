namespace LearnHub.Data;

// Created a PagedResult<T> for return paginated data for all entities
public class PagedResult<T>
{
    public IEnumerable<T> Items {get; set;} = [];
    public int Page {get; set;}
    public int PageSize {get; set;}
    public int TotalItems {get; set;}
    public int TotalPages {get; set;}
}