using System.DirectoryServices.AccountManagement;
using System.Threading.Tasks;

namespace AuthenticationMapper
{
    public class Startup
    {

        public async Task<object> Invoke(dynamic input)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(input.UserName) || string.IsNullOrWhiteSpace(input.Password))
                    return false;

                using (var pc = new PrincipalContext(ContextType.Domain, input.Domain))
                {
                    return pc.ValidateCredentials(input.UserName, input.Password);
                }
            }
            catch
            {
                return false;
            }
        }
    }
}