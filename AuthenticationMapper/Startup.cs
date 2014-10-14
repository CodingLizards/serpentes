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

        public async Task<object> Invoke(object input)
        {
            IDictionary<string, object> payload = (IDictionary<string, object>)input;
            string Domain = (string)payload["Domain"];
            string UserName = (string)payload["UserName"];
            string Password = (string)payload["Password"];
            WindowsIdentity id = LogonUserTCPListen(UserName, Domain, Password);
            return id.IsAuthenticated;
        }

        private static WindowsIdentity LogonUserTCPListen(string userName, string domain, string password)
        {
            // need a full duplex stream - loopback is easiest way to get that
            TcpListener tcpListener = new TcpListener(IPAddress.Loopback, 0);
            tcpListener.Start();
            ManualResetEvent done = new ManualResetEvent(false);

            WindowsIdentity id = null;
            tcpListener.BeginAcceptTcpClient(delegate(IAsyncResult asyncResult)
            {
                try
                {
                    using (NegotiateStream serverSide = new NegotiateStream(
                    tcpListener.EndAcceptTcpClient(asyncResult).GetStream()))
                    {
                        serverSide.AuthenticateAsServer(CredentialCache.DefaultNetworkCredentials,
                        ProtectionLevel.None, TokenImpersonationLevel.Impersonation);
                        id = (WindowsIdentity)serverSide.RemoteIdentity;
                    }
                }
                catch
                { id = null; }
                finally
                { done.Set(); }
            }, null);

            using (NegotiateStream clientSide = new NegotiateStream(new TcpClient("localhost",
             ((IPEndPoint)tcpListener.LocalEndpoint).Port).GetStream()))
            {
                try
                {
                    clientSide.AuthenticateAsClient(new NetworkCredential(userName, password, domain),
                    "", ProtectionLevel.None, TokenImpersonationLevel.Impersonation);
                }
                catch
                { id = null; }//When the authentication fails it throws an exception
            }
            tcpListener.Stop();
            done.WaitOne();//Wait until we really have the id populated to continue
            return id;
        }

    }
}