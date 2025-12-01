public class Matrix {
public static void main(String[] args) {
int[][] A = {{1, 2},{3, 4}};
int[][] B = {{5, 6},{7, 8}};
int[][] result = new int[2][2];
for (int i = 0; i < 2; i++) {           
for (int j = 0; j < 2; j++) {       
for (int k = 0; k < 2; k++) {   
result[i][j] += A[i][k] * B[k][j];
}}}
System.out.println("Product of the matrices:");
for (int i = 0; i < 2; i++) {
for (int j = 0; j < 2; j++) {
System.out.print(result[i][j] + " ");
}
System.out.println();
}}
}
