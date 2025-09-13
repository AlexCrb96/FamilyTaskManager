using FamilyTaskManagerAPI.Utils;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace FamilyTaskManagerAPI.Services
{
    public class MailService
    {
        private readonly MailSettings _settings;

        public MailService(IOptions<MailSettings> options)
        {
            _settings = options.Value;
        }

        public async Task SendEmailAsync(string toEmail, string toFirstName, string toLastName, string subject, string htmlBody)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Task Manager App", _settings.FromEmail));
            message.To.Add(new MailboxAddress($"{toFirstName} {toLastName}", toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html")
            {
                Text = htmlBody
            };

            try
            {
                using var client = new MailKit.Net.Smtp.SmtpClient();

                client.LocalDomain = "danielmanoliu.ro";
                await client.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_settings.SmtpUser, _settings.SmtpPass);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email.");
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

/*        public void SendEmail(string toEmail, string toFirstName, string toLastName, string subject, string htmlBody)
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
        }*/
    }
}
