package ca.carleton.gcrc.couch.metadata;

import ca.carleton.gcrc.couch.client.CouchDb;
import ca.carleton.gcrc.couch.utils.CouchNunaliitConstants;
import junit.framework.TestCase;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;
import org.mockito.Mockito;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;

import static org.mockito.Mockito.mock;

public class SitemapBuilderThreadTest extends TestCase {

    private SitemapBuilderThread sitemapBuilderThread;

    @Override
    protected void setUp() throws Exception {
        super.setUp();

        CouchDb couchDb = mock(CouchDb.class);
        Mockito.when(couchDb.getDocument("level_1")).thenReturn(new JSONObject(
                IOUtils.toString(getClass().getResourceAsStream("/navigation/levels_1.json"), StandardCharsets.UTF_8)));
        Mockito.when(couchDb.documentExists("level_1")).thenReturn(true);
        Mockito.when(couchDb.getDocument("level_2")).thenReturn(new JSONObject(
                IOUtils.toString(getClass().getResourceAsStream("/navigation/levels_2.json"), StandardCharsets.UTF_8)));
        Mockito.when(couchDb.documentExists("level_2")).thenReturn(true);
        Mockito.when(couchDb.getDocument("level_3")).thenReturn(new JSONObject(
                IOUtils.toString(getClass().getResourceAsStream("/navigation/levels_3.json"), StandardCharsets.UTF_8)));
        Mockito.when(couchDb.documentExists("level_3")).thenReturn(true);
        Mockito.when(couchDb.getDocument(CouchNunaliitConstants.ATLAS_DOC_ID)).thenReturn(new JSONObject(
                IOUtils.toString(getClass().getResourceAsStream("/navigation/atlas.json"), StandardCharsets.UTF_8)));
        Mockito.when(couchDb.documentExists("atlas")).thenReturn(true);

        sitemapBuilderThread = new SitemapBuilderThread(couchDb, new LinkedBlockingQueue<String>());
    }

    public void testOneLevelNavigation() {
        sitemapBuilderThread.processDocId("level_1");
        List<String> relativeUrls = sitemapBuilderThread.getRelativeUrls();

        assertNotNull(relativeUrls);
        assertEquals(4, relativeUrls.size());
        assertTrue(relativeUrls.contains("./index.html"));
        assertTrue(relativeUrls.contains("./tools/index.html"));
        assertTrue(relativeUrls.contains("./index.html?module=module.test2_canvas"));
        assertTrue(relativeUrls.contains("./index.html?module=module.demo"));
    }

    public void testTwoLevelNavigation() {
        sitemapBuilderThread.processDocId("level_2");
        List<String> relativeUrls = sitemapBuilderThread.getRelativeUrls();

        assertNotNull(relativeUrls);
        assertEquals(15, relativeUrls.size());
        assertTrue(relativeUrls.contains("./index.html"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.seaice"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.conservation"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.aboutatlas"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.ncri.explore"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.boundaries"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.weatherstationdatavisualizer"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.placenames"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.oldsettlement"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.ocean.protecting"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.ncri.birds"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.ncri.fish"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.contactus"));
        assertTrue(relativeUrls.contains("./index.html?module=module.sleepyriver.ncri.marinemammals"));
    }

    public void testThreeLevelNavigation() {
        sitemapBuilderThread.processDocId("level_3");
        List<String> relativeUrls = sitemapBuilderThread.getRelativeUrls();

        assertNotNull(relativeUrls);
        assertEquals(5, relativeUrls.size());
        assertTrue(relativeUrls.contains("./index.html"));
        assertTrue(relativeUrls.contains("./tools/index.html"));
        assertTrue(relativeUrls.contains("./index.html?module=module.test5_map"));
        assertTrue(relativeUrls.contains("./index.html?module=module.test5_canvas"));
        assertTrue(relativeUrls.contains("./index.html?module=module.test5_anothermodule"));
    }

    public void testAtlasDocNavigation() {
        sitemapBuilderThread.processDocId("atlas");
        List<String> relativeUrls = sitemapBuilderThread.getRelativeUrls();

        assertNotNull(relativeUrls);
        assertEquals(5, relativeUrls.size());
        assertTrue(relativeUrls.contains("./index.html"));
        assertTrue(relativeUrls.contains("./tools/index.html"));
        assertTrue(relativeUrls.contains("./index.html?module=module.canvas"));
        assertTrue(relativeUrls.contains("./index.html?module=module.demo"));
        assertTrue(relativeUrls.contains("./index.html?module=module.map"));
    }
}
