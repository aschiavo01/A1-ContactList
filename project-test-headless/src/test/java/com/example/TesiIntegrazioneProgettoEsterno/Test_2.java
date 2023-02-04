package com.example.Prova6;

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

public class Test_2{
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
  public void test_loc_Robula_release_1_1() throws Exception{
    driver.get("http://localhost:3001/");
    driver.findElement(By.xpath("//input[@formcontrolname='firstName']")).click();
    driver.findElement(By.xpath("//input[@formcontrolname='firstName']")).clear();
    driver.findElement(By.xpath("//input[@formcontrolname='firstName']")).sendKeys("ciao");
    driver.findElement(By.xpath("//input[@formcontrolname='lastName']")).click();
    driver.findElement(By.xpath("//input[@formcontrolname='lastName']")).clear();
    driver.findElement(By.xpath("//input[@formcontrolname='lastName']")).sendKeys("marco");
    driver.findElement(By.xpath("//input[@formcontrolname='email']")).click();
    driver.findElement(By.xpath("//input[@formcontrolname='email']")).clear();
    driver.findElement(By.xpath("//input[@formcontrolname='email']")).sendKeys("si");
    driver.findElement(By.xpath("//button[@type='submit']")).click();
    assertEquals("6",driver.findElement(By.xpath("//div[@class='number']")).getText());
    assertEquals("de luca",driver.findElement(By.xpath("//tr[4]/td[3]")).getText());
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
