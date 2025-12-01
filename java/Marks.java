import java.util.Scanner;
public class Mark{
public static void main(String args[]){
Scanner sc=new Scanner(System.in);
System.out.println("Enter the number of Subjects:");
int n=sc.nextInt();
int sub[]=new int[n];
System.out.println("Enter the Subject marks:");
for(int i=0;i<n;i++){
sub[i]=sc.nextInt();
}
for(int i=0;i<n;i++){
System.out.println("Subject"+i+"Marks:"+sub[i]);
}
int total=0;
for(int i=0;i<n;i++){
total=total+sub[i];
}
System.out.println("The total subject mark is:"+total);
}
}