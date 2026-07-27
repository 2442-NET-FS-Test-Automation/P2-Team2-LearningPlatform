using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LearnHub.Data.Repositories;
using LearnHub.Api.DTOs.Courses;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using LearnHub.Api.Filters;

namespace LearnHub.Api.Controllers;

// Define Controller route
[ServiceFilter(typeof(LogActionDurationFilter))]
[Route("api/[controller]")]
[ApiController]
public class CoursesController : ControllerBase
{
    // Our Repository context
    private readonly ICourseRepo _repo;
    
    //adding cache
    private readonly IMemoryCache _cache;

    private const string CoursesCacheTokenKey = "courses-cache-token";

    private CancellationTokenSource GetCoursesCacheToken()
    {
        if(!_cache.TryGetValue(CoursesCacheTokenKey, out CancellationTokenSource? cts)
        || cts is null
        || cts.IsCancellationRequested)
        {
            cts = new CancellationTokenSource();
            _cache.Set(CoursesCacheTokenKey, cts);
        }

        return cts;
    }

    private void InvalidateCoursesCache()
    {
        if(_cache.TryGetValue(CoursesCacheTokenKey, out CancellationTokenSource? cts)
        && cts is not null)
        {
            cts.Cancel();
            _cache.Remove(CoursesCacheTokenKey);
        }
    }


    // Builder
    public CoursesController(ICourseRepo repo, IMemoryCache cache)
    {
        _repo = repo;
        _cache = cache;
    }


    // Define endpoint route
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<CourseListDto>>> GetCourses(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchName = null,
        [FromQuery] CourseCategory? categoryFilter = null,
        [FromQuery] bool? isActiveFilter = null,
        [FromQuery] bool detail = false

    )
    {   
        // Set pagination limits
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        //cache key
        var cacheKey = $"courses:all:page{page}:size{pageSize}:search{searchName}:category:{categoryFilter}:isActive:{isActiveFilter}:detail:{detail}";

        if(_cache.TryGetValue(cacheKey, out PagedResult<CourseListDto>? cachedResponse) && cachedResponse is not null)
        {    
            return Ok(cachedResponse);
        }

        // await for the courses
        var result = await _repo.GetAllAsync(page, pageSize, searchName, categoryFilter, isActiveFilter);
        
        if (detail == false)
        {
            var response = new PagedResult<CourseListDto>
            {
                Items = result.Items.Select(c => new CourseListDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Category = c.CategoryName.ToString(),
                    IsActive = c.IsActive,
                    Price = c.EnrollmentPrice
                }).ToList(),

                Page = result.Page,
                PageSize = result.PageSize,
                TotalItems = result.TotalItems,
                TotalPages = result.TotalPages
            };

            //set cache response
            var cts = GetCoursesCacheToken();

            var options = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(15))
                .AddExpirationToken(new CancellationChangeToken(cts.Token));


            _cache.Set(cacheKey, response, options);

            // return message + response
            return Ok(response);
        }   
        else
        {
            return Ok("details");
        }
    }

    [HttpGet("enabled")]
    public async Task<ActionResult<IEnumerable<CourseListDto>>> GetEnabledCourses(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchName = null,
        [FromQuery] CourseCategory? categoryFilter = null
    )
    {
        // Set pagination limits
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;


        //cache key
        var cacheKey = $"courses:all:page{page}:size{pageSize}:search{searchName}:category:{categoryFilter}:isActive:{true}";

        if(_cache.TryGetValue(cacheKey, out PagedResult<CourseListDto>? cachedResponse) && cachedResponse is not null)
        {
            return Ok(cachedResponse);
        }

        // await for the courses
        var result = await _repo.GetAllAsync(page, pageSize, searchName, categoryFilter, true);
        
        var response = new PagedResult<CourseListDto>
        {
            Items = result.Items.Select(c => new CourseListDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Category = c.CategoryName.ToString(),
                IsActive = c.IsActive
            }).ToList(),

            Page = result.Page,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages
        };


        //set cache response

        var cts = GetCoursesCacheToken();

        var options = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(15))
            .AddExpirationToken(new CancellationChangeToken(cts.Token));

        _cache.Set(cacheKey, response, options);

        // return message + response
        return Ok(response);
    }

    [HttpGet("{id:int}")]
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

            var schedule = await _repo.GetCourseScheduleById(id);

            // create the dto in base of the object
            var dto = new CourseDetailDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                About = course.About,
                Category = course.CategoryName.ToString(),
                Price = course.EnrollmentPrice,
                Hours = course.Hours,
                Capacity = course.Capacity,
                IsActive = course.IsActive,
                Certification = course.Certification,

                Instructor =
                    course.Professor != null
                        ? course.Professor.User.FirstName + " " +
                        course.Professor.User.LastName
                        : "No assigned",
                EnrolledStudents = enrolledStudents,
                Schedule = schedule
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
    [Authorize(Roles = "Admin")]
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
        
        if (dto.Schedule != null && dto.Schedule.Any())
        {
            var mappedSchedules = dto.Schedule.Select(s => new CourseSchedule
            {
                Day = s.Day,
                StartTime = s.StartTime,
                EndTime = s.EndTime
            }).ToList();
            await _repo.UpdateScheduleAsync(createdCourse.Id, mappedSchedules);
        }

        InvalidateCoursesCache();

        // Return where you can consult the createdCourse and the required parameters
        return CreatedAtAction(
            nameof(GetCourse),
            new {id = course.Id},
            createdCourse
        );
    }

    [HttpPatch("{id:int}")]
    [Authorize(Roles = "Admin,Professor")]
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

            // await for  update the info with our data
            await _repo.UpdateAsync(course);
            
            if (dto.Schedule != null)
            {
                var mappedSchedules = dto.Schedule.Select(s => new CourseSchedule
                {
                    Day = s.Day,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime
                }).ToList();
                await _repo.UpdateScheduleAsync(id, mappedSchedules);
            }

            InvalidateCoursesCache();

            // return noContent
            return NoContent();
        }
        return BadRequest();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        if(DataTypeVerification.IsNumValid(id))
        {
            var course = await _repo.GetByIdAsync(id);

            if(course == null) return NotFound();

            await _repo.DeleteAsync(course);
            InvalidateCoursesCache();

            return NoContent();
        }
        return BadRequest();
    }

    [HttpPost("{id:int}/reactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReactivateCourse(int id)
    {
        if (DataTypeVerification.IsNumValid(id))
        {
            var course = await _repo.GetByIdAsync(id);

            if (course == null) return NotFound();

            course.IsActive = true;
            await _repo.UpdateAsync(course);
            InvalidateCoursesCache();
            return NoContent();
        }
        return BadRequest();
    }
}
