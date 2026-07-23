using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ProfessorController: ControllerBase
{
    private readonly IUserRepo _userRepo;
    private readonly IProfessorRepo _professorRepo;

    public ProfessorController(IUserRepo userRepo, IProfessorRepo professorRepo)
    {
        _userRepo = userRepo;
        _professorRepo = professorRepo;
    }

}