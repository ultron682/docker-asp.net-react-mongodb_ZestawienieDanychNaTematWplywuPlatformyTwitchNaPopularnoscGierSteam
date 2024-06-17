using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjektASP_NET.Interface;
using ProjektASP_NET.Models;
using System.ComponentModel.DataAnnotations;

namespace ProjektASP_NET.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class GameController : Controller
    {
        private readonly IGameRepository _gameRepository;

        public GameController(IGameRepository gameRepository)
        {
            _gameRepository = gameRepository;
        }

        [HttpGet("{gameId}", Name = nameof(GetGameByGameIdAsync))]
        public async Task<IActionResult> GetGameByGameIdAsync([Required] string gameId)
        {
            SteamAndTwitch game = await _gameRepository.GetByGameIdAsync(gameId);
            if (game == null)
            {
                return NotFound();
            }

            var viewersOnTwitch = game.twitch.GameStats.Select(stat => new
            {
                date = stat.Date,
                viewers = stat.Viewers
            });


            var response = game.steam.GameStats.Select(stat => new
            {
                date = stat.Date,
                playersOnSteam = stat.PlayersCount,
                viewersOnTwitch = viewersOnTwitch.Where(s => s.date == stat.Date).First().viewers
            });


            return Ok(response);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetGameListAsync()
        {
            var games = await _gameRepository.GetGameListAsync();
            var gameList = games.Select(g => new
            {
                game_id = g.GameId,
                game_name = g.GameName
            });
            return Ok(gameList);
        }

        [HttpGet("all-stats")]
        public async Task<IActionResult> GetAllGameStatsAsync()
        {
            var gameStats = await _gameRepository.GetAllGameStatsAsync();
            return Ok(gameStats);
        }
    }
}
