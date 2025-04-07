#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTI18nUtil.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
#import "Orientation.h"
#import "RNSplashScreen.h"  // <-- Add this import

@implementation AppDelegate

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   [FIRApp configure];
   self.moduleName = @"zoul";
   // You can add your custom initial props in the dictionary below.
   // They will be passed down to the ViewController used by React Native.
   self.initialProps = @{};
   
   bool didFinish = [super application:application didFinishLaunchingWithOptions:launchOptions];

   // Add this line to show the splash screen
   [RNSplashScreen show];  // <-- This will display the splash screen

   [[FBSDKApplicationDelegate sharedInstance] application:application
                       didFinishLaunchingWithOptions:launchOptions];
 
   NSString *objLANGUAGE = [[NSUserDefaults standardUserDefaults]
      stringForKey:@"LANGUAGE"];
  
   NSLog(@"[[RCTI18nUtil sharedInstance] isRTL] 00 %@", objLANGUAGE);
  
   NSString *language = [[NSLocale preferredLanguages] objectAtIndex:0];
  
   if(objLANGUAGE != nil){
    if ([objLANGUAGE isEqualToString:@"ar"])
    {
      [[RCTI18nUtil sharedInstance] allowRTL:YES];
      [[RCTI18nUtil sharedInstance] forceRTL:YES];
      [[RCTI18nUtil sharedInstance] swapLeftAndRightInRTL:YES];
      
      NSLog(@"[[RCTI18nUtil sharedInstance] isRTL] 11 %@", objLANGUAGE);
    }
    else
    {
      [[RCTI18nUtil sharedInstance] allowRTL:NO];
      [[RCTI18nUtil sharedInstance] forceRTL:NO];
      [[RCTI18nUtil sharedInstance] swapLeftAndRightInRTL:NO];
      NSLog(@"[[RCTI18nUtil sharedInstance] isRTL] 22 %@", objLANGUAGE);
    }
  }
  else
  {
    if ([language rangeOfString:@"ar"].location == NSNotFound) {
      [[RCTI18nUtil sharedInstance] allowRTL:NO];
      [[RCTI18nUtil sharedInstance] forceRTL:NO];
      [[RCTI18nUtil sharedInstance] swapLeftAndRightInRTL:NO];
      NSLog(@"[[RCTI18nUtil sharedInstance] isRTL] 33 %@", language);
    } else {
      [[RCTI18nUtil sharedInstance] allowRTL:YES];
      [[RCTI18nUtil sharedInstance] forceRTL:YES];
      [[RCTI18nUtil sharedInstance] swapLeftAndRightInRTL:YES];
      NSLog(@"[[RCTI18nUtil sharedInstance] isRTL] 44 %@", language);
    }
  }

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(nonnull NSDictionary<NSString *,id> *)options {
  return [GIDSignIn.sharedInstance handleURL:url];
}

@end
