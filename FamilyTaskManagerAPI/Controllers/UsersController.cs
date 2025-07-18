using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Services;
using FamilyTaskManagerAPI.DTOs;
using FamilyTaskManagerAPI.Utils;

namespace FamilyTaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly UserService _userService;
        private readonly JwtProvider _jwtProvider;

        public UsersController(UserService userService, JwtProvider jwtProvider)
        {
            _userService = userService;
            _jwtProvider = jwtProvider;
        }

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
                string registeredUserId = await _userService.RegisterUserAsync(input, dto.Password);
            }
            catch(Exception ex)
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
                input = await _userService.LoginUserAsync(input, dto.Password);
            }
            catch(Exception ex)
            {
                return Problem(
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: "An error occurred while logging in the user.");
            }

            var token = _jwtProvider.GenerateAuthToken(input);
            return Ok(token);
        }
    }
}
