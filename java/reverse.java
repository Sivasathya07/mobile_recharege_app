import java.util.Scanner;
public class reverse
{
public static void main(String args[]){
Scanner sc = new Scanner(System.in);
System.out.println("Enter the number");
int number = sc.nextInt();
int rev = 0;
    int n = number;
    while (n != 0) {
        int digit = n % 10;
        rev = rev * 10 + digit;
        n /= 10;
    }
System.out.println("The reversed number is :" +rev);
}}