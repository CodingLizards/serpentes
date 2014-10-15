using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Security;
using System.Net.Sockets;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;

namespace AuthenticationMapper
{
    public class Startup
    {

        public async Task<object> Invoke(dynamic input)
        {
            var Domain = input.Domain;
            var UserName = input.UserName;
            var Password = input.Password;
            var id = LogonUserTCPListen(UserName, Domain, Password);
            return id.IsAuthenticated;
        }

        private static WindowsIdentity LogonUserTCPListen(string userName, string domain, string password)
        {
            // need a full duplex stream - loopback is easiest way to get that
            var tcpListener = new TcpListener(IPAddress.Loopback, 0);
            tcpListener.Start();
            var done = new ManualResetEvent(false);

            var id = default(WindowsIdentity);
            tcpListener.BeginAcceptTcpClient(delegate(IAsyncResult asyncResult)
            {
                try
                {
                    using (var serverSide = new NegotiateStream(
                    tcpListener.EndAcceptTcpClient(asyncResult).GetStream()))
                    {
                        serverSide.AuthenticateAsServer(CredentialCache.DefaultNetworkCredentials, ProtectionLevel.None, TokenImpersonationLevel.Impersonation);
                        id = (WindowsIdentity)serverSide.RemoteIdentity;
                    }
                }
                catch
                {
                    id = null;
                }
                finally
                {
                    done.Set();
                }
            }, null);

            using (var clientSide = new NegotiateStream(new TcpClient("localhost", ((IPEndPoint)tcpListener.LocalEndpoint).Port).GetStream()))
            {
                try
                {
                    clientSide.AuthenticateAsClient(new NetworkCredential(userName, password, domain), "", ProtectionLevel.None, TokenImpersonationLevel.Impersonation);
                }
                catch
                {
                    id = null;
                }
            }
            tcpListener.Stop();
            done.WaitOne();
            return id;
        }

    }
}