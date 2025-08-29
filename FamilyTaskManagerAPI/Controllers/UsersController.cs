using Microsoft.AspNetCore.Mvc;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Services;
using FamilyTaskManagerAPI.Utils;
using System.ComponentModel.DataAnnotations;
using FamilyTaskManagerAPI.DTOs.Mappers;
using FamilyTaskManagerAPI.DTOs.Requests;
using FamilyTaskManagerAPI.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;

namespace FamilyTaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : BaseApiController
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequestDTO dto)
        {
            User input = dto.ToUser();            
            string registeredUserId = await _userService.RegisterUserAsync(input, dto.Password);
            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserRequestDTO dto)
        {
            User input = dto.ToUser();            
            input = await _userService.LoginUserAsync(input, dto.Password);   
            var token = _userService.GenerateLoginToken(input);
            return Ok(token);
        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetAllUsers()
        {
            List<User> users = await _userService.GetAllUsersAsync();
            List<UserResponseDTO> usersDto = users.Select(u => u.ToUserResponse()).ToList();
            return Ok(usersDto);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDTO dto)
        {
            await _userService.SendPasswordResetEmail(dto.Email);
            return Ok("Password reset email sent successfully.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDTO dto)
        {
            
            await _userService.ResetUserPasswordAsync(dto.Token, dto.NewPassword);
            return Ok("Password reset successfully.");
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDTO dto)
        {
            await _userService.ChangePasswordAsync(GetCurrentUserId(), dto.OldPassword, dto.NewPassword);
            return Ok("Password changed successfully.");
        }

        [Authorize]
        [HttpPut("change-name")]
        public async Task<IActionResult> ChangeName([FromBody] UpdateUserProfileRequestDTO dto)
        {
            await _userService.ChangeNameAsync(GetCurrentUserId(), dto.FirstName, dto.LastName);
            return Ok("User profile updated successfully.");
        }
    }
}
