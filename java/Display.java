import java.util.Scanner;
class Display
{
public static void main(String [] args)
{
Scanner sc=new Scanner(System.in); 
String name=sc.nextLine();
String dname=sc.nextLine();
String cname=sc.nextLine();
System.out.println("Name : "+name);
System.out.println("Dept : "+dname);
System.out.println("Clg  : "+cname);
}
}