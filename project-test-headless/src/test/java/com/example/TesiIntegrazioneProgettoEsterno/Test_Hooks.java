package com.example.Prova8;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;
import org.apache.commons.io.FileUtils;
import java.io.File;

public class Test_0{
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();
  JavascriptExecutor js;
  @Before
  public void setUp() throws Exception {
    System.setProperty("webdriver.chrome.driver", "");
    driver = new ChromeDriver();
    baseUrl = "https://www.google.com/";
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(60));
    js = (JavascriptExecutor) driver;
  }

  @Test
  public void test_loc_Hooks_release_1_1() throws Exception{
    driver.get("http://localhost:3001/");
    Thread.sleep(5000);
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-10]")).click();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-10]")).clear();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-10]")).sendKeys("Marco");
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-13]")).click();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-13]")).clear();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-13]")).sendKeys("De Luca");
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-17]")).click();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-17]")).clear();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-17]")).sendKeys("ciao@gmail.com");
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-18]")).click();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-20]//*[@x934110935862-x-test-tpl-1]//*[@x934110935862-x-test-hook-5]")).click();
    Thread.sleep(5000);
    assertEquals("4",driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-20]//*[@x934110935862-x-test-tpl-1]//*[@x934110935862-x-test-hook-3]")).getText());
    assertEquals("De Luca",driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-21]//*[@x934107962964-x-test-hook-22]//*[@x934112684301-x-test-tpl-1]//*[@x934112684301-x-test-hook-11][4]//*[@x934112684301-x-test-hook-14]")).getText());
  }

  @After
  public void tearDown() throws Exception {
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }

  private boolean isAlertPresent() {
    try {
      driver.switchTo().alert();
      return true;
    } catch (NoAlertPresentException e) {
      return false;
    }
  }

  private String closeAlertAndGetItsText() {
    try {
      Alert alert = driver.switchTo().alert();
      String alertText = alert.getText();
      if (acceptNextAlert) {
        alert.accept();
      } else {
        alert.dismiss();
      }
      return alertText;
    } finally {
      acceptNextAlert = true;
    }
  }
}
