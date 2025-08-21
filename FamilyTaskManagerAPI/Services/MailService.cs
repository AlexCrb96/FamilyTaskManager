using System.Net;
using System.Net.Mail;

namespace FamilyTaskManagerAPI.Services
{
    public class MailService
    {
        private readonly IConfiguration _configuration;

        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public void SendEmail(string toEmail, string subject, string body)
        {
            var smtpHost = _configuration["MailSettings:SmtpHost"];
            var smtpPort = int.Parse(_configuration["MailSettings:SmtpPort"]);
            var smtpUser = _configuration["MailSettings:SmtpUser"];
            var smtpPass = _configuration["MailSettings:SmtpPass"];
            var fromEmail = _configuration["MailSettings:FromEmail"];

            try
            {
                using (var client = new SmtpClient(smtpHost, smtpPort))
                {
                    client.Credentials = new NetworkCredential(smtpUser, smtpPass);
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage();

                    mailMessage.From = new MailAddress(fromEmail);
                    mailMessage.To.Add(toEmail);
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = true;

                    client.Send(mailMessage);
                }
                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email.");
                Console.WriteLine(ex.ToString());
                throw;
            }
        }
    }
}
