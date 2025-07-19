using Microsoft.AspNetCore.Mvc;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Services;
using FamilyTaskManagerAPI.DTOs;
using FamilyTaskManagerAPI.Utils;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController(UserService userService, JwtProvider jwtProvider) : Controller
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequestDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User input = dto.ToUser();
            try
            {
                await userService.RegisterUserAsync(input, dto.Password);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return Problem(
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: "An error occurred while registering the user.");
            }

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserRequestDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User input = dto.ToUser();
            try
            {
                input = await userService.LoginUserAsync(input, dto.Password);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ValidationException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return Problem(
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: "An error occurred while logging in the user.");
            }

            var token = jwtProvider.GenerateAuthToken(input);
            return Ok(token);
        }
    }
}
