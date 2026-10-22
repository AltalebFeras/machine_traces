
public class app {

    public static void main(String[] args) {
        System.out.println("Création d'un tableau de 10 entiers aléatoires entre 1 et 100");
        int[] tab = nouveauTab(10, 1, 100);
        System.out.println(tabEnChaine(tab));

        // System.out.println("changer les valeurs du tableau à 0");
        // changerValeurs(tab, 0);
        // System.out.println(tabEnChaine(tab));
        // incrValeurs(tab);
        // System.out.println("incrémenter les valeurs du tableau de 1");
        // sommeValeurs(tab);
        // System.out.println(sommeValeurs(tab));
        // ratioPairs(tab);
        // System.out.println(ratioPairs(tab)+ " %");
        // System.out.println(maxValue(tab));
        // System.out.println(appartient(5, tab));
        System.out.println(estTrie(tab));

    }

    public static int[] nouveauTab(int taille, int vMin, int vMax) {
        int[] tab = new int[taille];
        for (int i = 0; i < taille; i++) {
            tab[i] = (int) (Math.random() * (vMax - vMin + 1)) + vMin;
        }
        return tab;
    }

    public static String tabEnChaine(int[] tab) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < tab.length; i++) {
            sb.append(tab[i]);
            if (i < tab.length - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }

    public static void changerValeurs(int[] tab, int val) {
        for (int i = 0; i < tab.length; i++) {
            tab[i] = val;
        }
    }

    public static void incrValeurs(int[] tab) {
        for (int i = 0; i < tab.length; i++) {
            tab[i] += 1;
        }
    }

    public static int sommeValeurs(int[] tab) {
        int somme = 0;
        for (int i = 0; i < tab.length; i++) {
            somme += tab[i];
        }
        return somme;
    }

    public static double ratioPairs(int[] tab) {
        int countPairs = 0;
        for (int i = 0; i < tab.length; i++) {
            if (tab[i] % 2 == 0) {
                countPairs++;
            }
        }
        return (double) countPairs / tab.length * 100;
    }

    public static int maxValue(int[] tab) {

        int max = tab[0];
        for (int i = 1; i < tab.length; i++) {
            if (tab[i] > max) {
                max = tab[i];
            }
        }
        return max;
    }

    public static boolean appartient(int val, int[] tab) {
        for (int i = 0; i < tab.length; i++) {
            if (tab[i] == val) {
                return true;
            }
        }
        return false;

    }

    public static boolean estTrie(int[] tab) {
        for (int i = 0; i < tab.length - 1; i++) {
            if (tab[i] > tab[i + 1] ) {
                return false;
            }
        }
        return true;
    }
}
