import java.util.Scanner;
public class Hello
{
public static void main(String args[]){
Scanner sc = new Scanner(System.in);
System.out.println("Enter any number");
 int number = sc.nextInt();
if(number % 2 == 0){
System.out.println("Even number");
}
else
{
System.out.println("Odd number");
}
}}