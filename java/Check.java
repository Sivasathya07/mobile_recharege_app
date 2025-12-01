import java.util.Scanner;
public class Check
{
public static void main(String args[]){
Scanner sc = new Scanner(System.in);
System.out.println("Enter any number");
 int number = sc.nextInt();
if(number == 0){
System.out.println("number is zero");
}
else if(number < 0)
{
System.out.println("Negative number");
}
else
{
System.out.println("Positive number");
}
}}