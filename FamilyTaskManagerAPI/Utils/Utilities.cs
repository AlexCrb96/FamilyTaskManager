using System.Globalization;
using System.Text.RegularExpressions;

namespace FamilyTaskManagerAPI.Utils
{
    public class Utilities
    {
        public const string PasswordRegEx = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$";

        public static string ToTitleCase(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            input = Regex.Replace(input.Trim(), @"\s+", " ");

            TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;
            return textInfo.ToTitleCase(input.ToLower());
        }
    }
}
