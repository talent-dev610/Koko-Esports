package club.kokonats.koko;

import android.content.res.Configuration;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.ReactInstanceManager;

public class MainActivity extends ReactActivity {
    static String currentLocale;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Kokonats";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      MainActivity.currentLocale = getResources().getConfiguration().locale.toString();
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);

      String locale = newConfig.locale.toString();
      if (!MainActivity.currentLocale.equals(locale)) {
          MainActivity.currentLocale = locale;
          final ReactInstanceManager instanceManager = getReactInstanceManager();
          instanceManager.recreateReactContextInBackground();
      }
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
