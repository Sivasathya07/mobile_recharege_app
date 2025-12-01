import java.util.Scanner;
public class sort{
public static void main(String args[]) {
Scanner s = new Scanner(System.in);
int num[] = new int[5];    
for (int i = 0; i < 5; i++) {
num[i] = s.nextInt();
}  
for (int i = 0; i < 5 - 1; i++) {
for (int j = 0; j < 5 - i - 1; j++) {
if (num[j] > num[j + 1]) {                 
int temp = num[j];
num[j] = num[j + 1];
num[j + 1] = temp;
}
}
}       
for (int i = 0; i < 5; i++) {
System.out.println(num[i]);
}
}
}
