using LearnHub.Api.Services;
using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace LearnHub.Tests.Unit;

public class AuthTests
{
    private readonly Mock<IPasswordHasher<User>> HasherMock = new();
    private readonly Mock<IProfessorRepo> ProfessorRepoMock = new();
    private readonly Mock<IStudentRepo> StudentRepoMock = new();
    private readonly Mock<IUserRepo> UserRepoMock = new();
    private readonly Mock<ICourseRepo> CourseRepoMock = new();
    private readonly Mock<ILogger<UserService>> LoggerMock = new();
    private readonly UserService Sut;
    private static string ValidBirthDate => DateOnly.FromDateTime(DateTime.Today.AddYears(-20)).ToString("yyyy-MM-dd");

    public AuthTests()
    {
        var options = new DbContextOptionsBuilder<LearnHubDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var dbContext = new LearnHubDbContext(options);
 
        HasherMock
            .Setup(h => h.HashPassword(It.IsAny<User>(), It.IsAny<string>()))
            .Returns("hashed-password");
 
        // Default happy path — individual tests override where the case needs a duplicate.
        UserRepoMock.Setup(r => r.EmailExistsAsync(It.IsAny<string>())).ReturnsAsync(false);
        UserRepoMock.Setup(r => r.UsernameExistsAsync(It.IsAny<string>())).ReturnsAsync(false);
 
        StudentRepoMock
            .Setup(r => r.AddAsync(It.IsAny<Student>()))
            .ReturnsAsync((Student s) => s.User);
 
        Sut = new UserService(
            dbContext,
            HasherMock.Object,
            ProfessorRepoMock.Object,
            StudentRepoMock.Object,
            UserRepoMock.Object,
            CourseRepoMock.Object,
            LoggerMock.Object);
    }
    
    // TC-AuthN-02 - REQ-01, registration age validation, sad path
    [Fact]
    public async Task RegisterUserAsync_BirthDateUnder12Years_FailsAgeValidation()
    {
        // Given
        var birthDate = DateOnly.FromDateTime(DateTime.Today.AddYears(-12).AddDays(1));
    
        // When
        var error = await Sut.RegisterUserAsync(
            username: "youngster",
            firstName: "Young",
            lastName: "Ster",
            email: "young@ster.com",
            bio: "",
            birthDate: birthDate.ToString("yyyy-MM-dd"),
            password: "password123");
    
        // Then
        Assert.Equal("You must be at least 12 years old to register", error);
        StudentRepoMock.Verify(
            r => r.AddAsync(It.IsAny<Student>()),
            Times.Never);
    }

    // TC-AuthN-02 - REQ-01, registration age validation, happy path
    [Fact]
    public async Task RegisterUserAsync_BirthDateExactly12Years_PassesAgeValidation()
    {
        // Given
        var birthDate = DateOnly.FromDateTime(DateTime.Today.AddYears(-12));
    
        // When
        var error = await Sut.RegisterUserAsync(
            username: "justturned12",
            firstName: "Just",
            lastName: "Turned",
            email: "just@turned.com",
            bio: "",
            birthDate: birthDate.ToString("yyyy-MM-dd"),
            password: "password123");
 
        // Then
        Assert.Null(error);
        StudentRepoMock.Verify(r => r.AddAsync(It.IsAny<Student>()), Times.Once);
    }

    // TC-AuthN-08 - REQ-02, credential verification, happy path
    [Fact]
    public async Task LoginUserAsync_PasswordMatchesHash()
    {
        // Given
        User _existingUser = new()
        {
            Id = 1,
            Username = "jdoe",
            Email = "jdoe@example.com",
            FirstName = "Jane",
            LastName = "Doe",
            PasswordHash = "known-hash-fixture",
            Role = UserRoles.Student,
            IsActive = true
        };

        UserRepoMock
            .Setup(r => r.GetByEmailOrUsernameAsync("jdoe"))
            .ReturnsAsync(_existingUser);

        HasherMock
            .Setup(h => h.VerifyHashedPassword(_existingUser, _existingUser.PasswordHash, "correct-password"))
            .Returns(PasswordVerificationResult.Success);
 
        // When
        var result = await Sut.LoginUserAsync("jdoe", "correct-password");
 
        // Then
        Assert.NotNull(result);
        Assert.Equal(_existingUser.Username, result!.Username);
    }

    // TC-AuthN-08 - REQ-02, credential verification, sad path
    [Fact]
    public async Task LoginUserAsync_PasswordDoesNotMatchHash_ReturnsNull()
    {
        // Given
        User _existingUser = new()
        {
            Id = 1,
            Username = "jdoe",
            Email = "jdoe@example.com",
            FirstName = "Jane",
            LastName = "Doe",
            PasswordHash = "known-hash-fixture",
            Role = UserRoles.Student,
            IsActive = true
        };

        UserRepoMock
            .Setup(r => r.GetByEmailOrUsernameAsync("jdoe"))
            .ReturnsAsync(_existingUser);

        HasherMock
            .Setup(h => h.VerifyHashedPassword(_existingUser, _existingUser.PasswordHash, "wrong-password"))
            .Returns(PasswordVerificationResult.Failed);

        // When
        var result = await Sut.LoginUserAsync("jdoe", "wrong-password");

        // Then
        Assert.Null(result);
    }

    // TC-AuthN-13 - REQ-05, registration uniqueness,
    [Theory]
    [InlineData(false, false, null)]                             // R1 — both unique: passes
    [InlineData(true, false, "Username already registered")]     // R2 — dup username only
    [InlineData(false, true, "Email already registered")]        // R3 — dup email only
    [InlineData(true, true, "Email already registered")]         // R4 — both dup: email is checked first
    public async Task RegisterUserAsync_UniquenessCombinations(
        bool usernameExists, bool emailExists, string? expectedError)
    {
        UserRepoMock.Setup(r => r.UsernameExistsAsync(It.IsAny<string>())).ReturnsAsync(usernameExists);
        UserRepoMock.Setup(r => r.EmailExistsAsync(It.IsAny<string>())).ReturnsAsync(emailExists);
 
        var error = await Sut.RegisterUserAsync(
            username: "someuser",
            firstName: "Some",
            lastName: "User",
            email: "some@user.com",
            bio: "",
            birthDate: ValidBirthDate,
            password: "password123");
 
        Assert.Equal(expectedError, error);
 
        StudentRepoMock.Verify(
            r => r.AddAsync(It.IsAny<Student>()),
            expectedError is null ? Times.Once() : Times.Never());
    }
}