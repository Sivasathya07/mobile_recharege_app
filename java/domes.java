import java.util.Scanner;
public class domes{
public static void main(String args[]){
Scanner sc=new Scanner(System.in);
System.out.println("Enter the age of a citizen:");
int age=sc.nextInt();
if(age>60){
System.out.println("Enter the units used by a citizen:");
int units=sc.nextInt();
if(units<200){
System.out.println("They are senior citizens and they can able to get the discount for units...");
}
else
{
System.out.println("they can able to get the discount for units...");
}
}
else
{
System.out.println("They are  not senior citizens");
}
}
}