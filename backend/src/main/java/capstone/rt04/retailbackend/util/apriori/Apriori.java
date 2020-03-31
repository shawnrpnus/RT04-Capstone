package capstone.rt04.retailbackend.util.apriori;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import static capstone.rt04.retailbackend.util.Constants.MARKET_BASKET_ANALYIS_FILE_PATH;

/**
 * Example of how to use APRIORI
 * algorithm from the source code.
 *
 * @author Philippe Fournier-Viger (Copyright 2008)
 */
@Service
public class Apriori {

    public List<List<Long>> performBasketAnalysis() throws IOException {

        String input = MARKET_BASKET_ANALYIS_FILE_PATH;
        String output = null;
        // Note : we here set the output file path to null
        // because we want that the algorithm save the
        // result in memory for this example.

        double minsup = 0.2; // means a minsup of (n) matching transactions (we used a relative support)

        // Applying the Apriori algorithm
        AlgoApriori algorithm = new AlgoApriori();

        // Uncomment the following line to set the maximum pattern length (number of items per itemset, e.g. 3 )
        // apriori.setMaximumPatternLength(3);

        Itemsets result = algorithm.runAlgorithm(minsup, input, output);
//        algorithm.printStats();
//        result.printItemsets(algorithm.getDatabaseSize());

        List<List<Long>> transactionIdsList = new ArrayList<>();
        List<Long> transactionIds;

        for (List<Itemset> level : result.getLevels()) {
            for (Itemset itemset : level) {
                transactionIds = new ArrayList<>();
                for (int transactionId : itemset.getItems()) {
                    transactionIds.add(Long.valueOf(transactionId));
                }
                if (transactionIds.size() > 1)
                    transactionIdsList.add(transactionIds);
            }
        }

//        for (List<Long> list : transactionIdsList) {
//            for (Long transactionId : list) {
//                System.out.print(transactionId + " ");
//            }
//            System.out.println();
//        }

        return transactionIdsList;
    }

    public static String fileToPath(String filename) throws UnsupportedEncodingException {
        System.out.println("filename : " + filename);
        URL url = Apriori.class.getResource(filename);
        return java.net.URLDecoder.decode(url.getPath(), "UTF-8");
    }
}
