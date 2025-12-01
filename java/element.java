import java.util.Scanner;
public class element
{
public static void main(String args []){
Scanner s=new Scanner(System.in);
int num [] = new int [5];
for(int i=0;i<5;i++){
num[i]=s.nextInt();
}for(int i=0;i<5;i++){
System.out.println(num[i]);  
}
int sum=num[0];
for(int i=0;i<5;i++){
if(num[i]>sum){
sum=num[i];
}}
System.out.println("THE LARGEST NUMBER IS "+sum);
}}