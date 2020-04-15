package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.util.apriori.AlgoApriori;
import capstone.rt04.retailbackend.util.apriori.Itemset;
import capstone.rt04.retailbackend.util.apriori.Itemsets;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

/**
 * Example of how to use APRIORI
 * algorithm from the source code.
 *
 * @author Philippe Fournier-Viger (Copyright 2008)
 */
@Service
public class AprioriService {

    public List<List<Long>> performBasketAnalysis(String path, String data) throws IOException {

        // String input = path;
        // String output = null;
        /** Note : we here set the output file path to null
         because we want that the algorithm save the
         result in memory for this example.
         */

        double minsup = 0.05; // means a minsup of (n) matching transactions (we used a relative support)

        // Applying the Apriori algorithm
        AlgoApriori algorithm = new AlgoApriori();

        // Uncomment the following line to set the maximum pattern length (number of items per itemset, e.g. 3 )
        // apriori.setMaximumPatternLength(3);

        Itemsets result;
        if (path != null) {
            result = algorithm.runAlgorithm(minsup, path, null, null);
        } else {
            result = algorithm.runAlgorithm(minsup, null, null, data);
        }
        // algorithm.printStats();
        // result.printItemsets(algorithm.getDatabaseSize());

        List<List<Long>> transactionIdsList = new ArrayList<>();
        List<Long> transactionIds;

        for (List<Itemset> level : result.getLevels()) {
            for (Itemset itemset : level) {
                transactionIds = new ArrayList<>();
                for (int transactionId : itemset.getItems()) {
                    transactionIds.add(Long.valueOf(transactionId));
                }
                if (transactionIds.size() == 2)
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
        URL url = AprioriService.class.getResource(filename);
        return java.net.URLDecoder.decode(url.getPath(), "UTF-8");
    }
}
