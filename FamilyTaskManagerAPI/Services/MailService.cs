using FamilyTaskManagerAPI.Utils;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace FamilyTaskManagerAPI.Services
{
    public class MailService
    {
        private readonly MailSettings _settings;

        public MailService(IOptions<MailSettings> options)
        {
            _settings = options.Value;
        }
        public void SendEmail(string toEmail, string toFirstName, string toLastName, string subject, string htmlBody)
        {
            try
            {
                using (var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort))
                {
                    client.Credentials = new NetworkCredential(_settings.SmtpUser, _settings.SmtpPass);
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage();

                    mailMessage.From = new MailAddress(_settings.FromEmail, "Task Manager App");
                    mailMessage.To.Add(new MailAddress(toEmail, $"{toFirstName} {toLastName}"));
                    mailMessage.Subject = subject;
                    mailMessage.Body = htmlBody;
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
