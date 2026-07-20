using System.Numerics;

namespace LearnHub.Data;

public static class DataTypeVerification
{
    public static bool IsNumValid<T>(T num) where T: INumber<T>
    {
        return num >= T.Zero;
    }

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