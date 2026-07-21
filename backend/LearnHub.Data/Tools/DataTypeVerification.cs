using System.Numerics;

namespace LearnHub.Data;

public static class DataTypeVerification
{
    // Function for verify if a number is > than -1
    public static bool IsNumValid<T>(T num) where T: INumber<T>
    {
        return num >= T.Zero;
    }

    // Function for verify if a string isnt empty or null, and had a Length limit
    public static bool IsStringValid(string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return false;
        }
        if(text.Trim().Length > 255)
        {
            return false;
        }
        return true;
    }
}