using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using LearnHub.Data.Repositories;

namespace LearnHub.Api.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseRepo _repo;


        public CoursesController(ICourseRepo repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            bool? active = null
        )
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 50) pageSize = 50;

            var result = await _repo.GetAllAsync(page, pageSize, active);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourseById(int id)
        {
            if (DataTypeVerification.IsNumValid(id))
            {
                var course = _repo.GetByIdAsync(id);
                
                if(course == null) return NotFound();

                return Ok(course);
            }
            return BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult<Course>> CreateCourse(Course course)
        {

            if(!await _repo.ProfessorExistsAsync(course.ProfessorId))
                return BadRequest();

            var createdCourse = await _repo.CreateAsync(course);

            return CreatedAtAction(
                nameof(GetCourses),
                new {id = course.Id},
                course
            );


            
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchCourse(int id)
        {
            if(DataTypeVerification.IsNumValid (id))
            {
                var course = await _repo.GetByIdAsync(id);

                if(course == null) return NotFound();

                await _repo.UpdateAsync(course);

                return NoContent();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            if(DataTypeVerification.IsNumValid(id))
            {
                var course = await _repo.GetByIdAsync(id);

                if(course == null) return NotFound();

                await _repo.DeleteAsync(course);

                return NoContent();
            }
            return BadRequest();
        }
    }
}
