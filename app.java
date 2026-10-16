public class app {
    public static void main(String[] args) {
        System.out.println("Hello from Snapdragon ARM64!");
        count();
    }


     
    public static void count() {
        int n = 10;
        int somme = 10;
        int i = 0;
        do {
            somme = somme + i;
            i += 1;
        } while (i < n);
        System.out.println("la somme des " + n +
                " premiers entiegfrs est " + somme);
    }
}
