using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using LearnHub.Data.Repositories;
using LearnHub.Api.DTOs.Courses;

namespace LearnHub.Api.Controllers

{
    // Define Controller route
    [Route("api/courses")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        // Our Repositorie context
        private readonly ICourseRepo _repo;

        // Builder
        public CoursesController(ICourseRepo repo)
        {
            _repo = repo;
        }


        // Define endpoint route
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseListDto>>> GetCourses(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        )
        {   
            // Set pagination limits
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 50) pageSize = 50;

            // If the user is in one of these roles set the variable as true
            bool canViewInactive = User.IsInRole(UserRoles.Admin.ToString()) ||
                                   User.IsInRole(UserRoles.Professor.ToString());

            // if canViewInactive == true then set is as null
            // because he can see without filter, if its false
            // then its a student, apply the filter in true
            bool? activeFilter = canViewInactive ? null : true;

            // await for the courses
            var result = await _repo.GetAllAsync(page, pageSize, activeFilter);
            
            var response = new PagedResult<CourseListDto>
            {
                Items = result.Items.Select(c => new CourseListDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Category = c.CategoryName
                }).ToList(),

                Page = result.Page,
                PageSize = result.PageSize,
                TotalItems = result.TotalItems,
                TotalPages = result.TotalPages
            };

            // return message + response
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDetailDto>> GetCourse(int id)
        {
            // Verify the id is valid
            if (DataTypeVerification.IsNumValid(id))
            {
                //  await for the course searched
                var course = await _repo.GetByIdAsync(id);
                
                // if the response is null then send a NotFound message
                if(course == null) return NotFound();

                // get the enrolled students
                var enrolledStudents = await _repo.GetEnrollmentCountAsync(id);

                // create the dto in base of the object
                var dto = new CourseDetailDto
                {
                    Id = course.Id,
                    Name = course.Name,
                    Description = course.Description,
                    About = course.About,
                    Category = course.CategoryName,
                    Price = course.EnrollmentPrice,
                    Hours = course.Hours,
                    Certification = course.Certification,

                    Instructor =
                        course.Professor.User.FirstName + " " +
                        course.Professor.User.LastName,
                    EnrolledStudents = enrolledStudents,
                    Schedule = course.Schedule
                        .Select(s => new CourseScheduleDto
                        {
                            Day = s.Day,
                            StartTime = s.StartTime,
                            EndTime = s.EndTime
                        })
                        .ToList()
                };

                // if all works, send Ok + response
                return Ok(dto);
            }
            // if the id isnt valid then return a BadRequest message
            return BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult<CourseDetailDto>> CreateCourse(CreateCourseDto dto)
        {
            // search for the Professor, if doesnt exist  then return BadRequest
            if(!await _repo.ProfessorExistsAsync(dto.ProfessorId))
                return BadRequest();

            // create a var course with the information from the dto parameter
            var course = new Course
            {
                ProfessorId = dto.ProfessorId,
                Name = dto.Name,
                Description = dto.Description,
                About = dto.About,
                CategoryName = dto.Category,
                Capacity = dto.Capacity,
                Certification = dto.Certification,
                Hours = dto.Hours,
                EnrollmentPrice = dto.Price,
                IsActive = true
            };

            // await for the creation of the course
            var createdCourse = await _repo.CreateAsync(course);

            // Return where you can consult the createdCourse and the required parameters
            return CreatedAtAction(
                nameof(GetCourse),
                new {id = course.Id},
                createdCourse
            );
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchCourse(int id, UpdateCourseDto dto)
        {
            if(DataTypeVerification.IsNumValid (id))
            {
                // await for the searching of the course with the id
                var course = await _repo.GetByIdAsync(id);

                // if course is null return notFound
                if (course == null)
                    return NotFound();

                // data verification, if the data isnt null or has value, then update the data
                if (dto.Name != null)
                    course.Name = dto.Name;

                if (dto.Description != null)
                    course.Description = dto.Description;

                if (dto.About != null)
                    course.About = dto.About;

                if (dto.Category.HasValue)
                    course.CategoryName = dto.Category.Value;

                if (dto.Capacity.HasValue)
                    course.Capacity = dto.Capacity.Value;

                if (dto.Price.HasValue)
                    course.EnrollmentPrice = dto.Price.Value;

                if (dto.Hours.HasValue)
                    course.Hours = dto.Hours.Value;

                if (dto.Certification.HasValue)
                    course.Certification = dto.Certification.Value;

                if (dto.IsActive.HasValue)
                    course.IsActive = dto.IsActive.Value;

                // await for  update the info with our data
                await _repo.UpdateAsync(course);

                // return noContent
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
