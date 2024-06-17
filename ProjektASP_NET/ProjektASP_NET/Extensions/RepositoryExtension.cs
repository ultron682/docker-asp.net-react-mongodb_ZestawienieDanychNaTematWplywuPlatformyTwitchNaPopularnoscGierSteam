using ProjektASP_NET.Interface;
using ProjektASP_NET.Services;

namespace ProjektASP_NET.Extensions
{
    public static class RepositoryExtension
    {
        public static IServiceCollection AddRepository(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IGameRepository, GameRepository>();
            return services;
        }
    }
}
