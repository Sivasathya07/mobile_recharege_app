import java.util.Scanner;
public class chess
{
public static void main(String args[]){
Scanner sc = new Scanner(System.in);
System.out.println("Enter total amount");
int amount = sc.nextInt();
if (amount>5000){
amount *= 0.20;
System.out.println("the amount is :" +amount);
}
else if (amount >= 3000 && amount <= 5000){
amount *= 0.15;
System.out.println("the amount is :" +amount);
}
else if (amount >= 1000 && amount <= 2999){
amount *= 0.10;
System.out.println("the amount is :" +amount);
}
else{
System.out.println("the amount is :" +amount);
}

}}