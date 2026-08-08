using LearnHub.Data;
using Microsoft.EntityFrameworkCore.Storage;

public class DatabaseFixture : IDisposable
{
    private readonly LearnHubDbContext _context;
    private IDbContextTransaction? _transaction;

    public DatabaseFixture(LearnHubDbContext context)
    {
        _context = context;
    }

    public async Task BeginTransaction()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task Rollback()
    {
        if(_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
        }
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}