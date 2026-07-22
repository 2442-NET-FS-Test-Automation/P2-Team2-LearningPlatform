

using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

public class ProfessorController: ControllerBase
{
    private readonly IUserRepo _userRepo;
    private readonly IProfessorRepo _professorRepo;

    public ProfessorController(IUserRepo userRepo, IProfessorRepo professorRepo)
    {
        _userRepo = userRepo;
        _professorRepo = professorRepo;
    }

    public async Task<ActionResult<PagedResult<ProfessorDto>>> GetProfessors(int page, int pageSize)
    {
        
    }
}