package com.example.TesiIntegrazioneProgettoEsterno;

import static org.junit.Assert.fail;

import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import io.github.bonigarcia.wdm.WebDriverManager;

public class Test_Katalon_prova {
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();
  JavascriptExecutor js;
  @Before
  public void setUp() throws Exception {
		  // Init chromedriver
		  //String chromeDriverPath = "/home/runner/work/HookTestRepo/HookTestRepo/chromedriver_v94_linux64/chromedriver";
		  //System.setProperty("webdriver.chrome.driver", chromeDriverPath);
		  WebDriverManager.chromedriver().setup();
		  System.setProperty("webdriver.chrome.whitelistedIps", "");
		  ChromeOptions options = new ChromeOptions();
		  options.addArguments("--headless", "--disable-gpu", "--window-size=1920,1200","--no-sandbox","--ignore-certificate-errors");
		  driver = new ChromeDriver(options);  
		  
		  
		  
	    driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS);
  }

  @Test
  public void testUntitledTestCase() throws Exception {
    driver.get("http://localhost:3001/");
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-10]")).click();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-10]")).clear();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-10]")).sendKeys("Alessandro");
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-13]")).clear();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-13]")).sendKeys("Schiavo");
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-17]")).clear();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-17]")).sendKeys("alessandro.schiavo@gmail.com");
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-18]")).click();
    driver.findElement(By.xpath("//*[@x934114515538-x-test-tpl-1]//*[@x934114515538-x-test-hook-9]//*[@x934107962964-x-test-tpl-2]//*[@x934107962964-x-test-hook-20]//*[@x934110935862-x-test-tpl-1]//*[@x934110935862-x-test-hook-5]")).click();
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
