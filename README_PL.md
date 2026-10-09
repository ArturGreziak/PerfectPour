# Perfect Pour — punkt kontrolny

Przygotowano dwie oddzielne implementacje: natywną Android/Kotlin oraz Web/JavaScript. 30 poziomów: przytrzymujesz, nalewasz do ruchomego kubka, puszczasz i sprawdzasz poziom. Próg trudności zwiększa prędkość ruchu oraz zmniejsza tolerancję. Rdzeń działa bez internetu. Teksty gry są po angielsku.

## Android Studio — uruchomienie
1. Zainstaluj Android Studio z https://developer.android.com/studio .
2. Rozpakuj paczkę. Na ekranie powitalnym wybierz **Open** i wskaż folder **ANDROID** (ten z `settings.gradle.kts`). Nie folder `app` ani cały folder PerfectPour.
3. W **Settings > Build, Execution, Deployment > Build Tools > Gradle > Gradle JDK** wybierz JDK 17 lub zgodny nowszy JDK. Projekt używa AGP 8.13.2, Gradle 8.13 i Kotlin 2.3.0, compile/target SDK 36, min SDK 24.
4. W **Tools > SDK Manager** zainstaluj **Android SDK Platform 36** i narzędzia SDK. Zaczekaj na **Gradle Sync**. Pierwsza synchronizacja wymaga internetu.
5. Emulator: **Tools > Device Manager > Create Device**, wybierz telefon oraz obraz systemu z Google Play. Uruchom emulator, wybierz konfigurację **app**, naciśnij **Run**.
6. Telefon: włącz **Developer options > USB debugging**, podłącz USB i zaakceptuj komunikat na telefonie. Wybierz telefon w Android Studio i **Run**.
7. W terminalu folderu ANDROID na Windows: `./gradlew.bat :app:testDebugUnitTest :app:assembleDebug` (PowerShell: `.\gradlew.bat :app:testDebugUnitTest :app:assembleDebug`). Linux/macOS: `./gradlew :app:testDebugUnitTest :app:assembleDebug`.
8. APK po udanej kompilacji znajdziesz w `app/build/outputs/apk/debug/app-debug.apk`. To paczka testowa. Niniejsze archiwum nie zawiera APK.

## Sterowanie i testowanie
- Dotknij i przytrzymaj pole gry, aby nalewać. Woda spada z opóźnieniem. Gdy kubek wyjedzie spod strumienia, krople przepadają.
- Puść, zaczekaj na opadnięcie kropel i wybierz **Check Pour**. Napełnienie musi zmieścić się w tolerancji wokół złotej kreski.
- **Pause / Resume** zatrzymuje i wznawia grę. Po powrocie z tła gra pozostaje zatrzymana.
- **Home** zapisuje rundę. **Continue Game** odtwarza zapis z kroplami i zaczyna od pauzy.
- Sprawdź brak internetu, szybkie dotknięcia, powrót z tła, ponowne próby, dokończenie poziomu 30 i **Settings > Reset Progress** (z potwierdzeniem).
- Ustawienia **Sound** i **Haptics** wyłączają dźwięki wyników i wibrację. Muzyka nie jest używana.

## Web — GitHub Pages
1. Folder WEB zawiera `index.html`, `style.css`, `engine.js`, `app.js`. Nie dodawaj plików ANDROID do strony.
2. Do lokalnego testu: w folderze WEB uruchom `python -m http.server 8000`, otwórz http://localhost:8000 .
3. Utwórz repozytorium GitHub, wgraj zawartość WEB do jego katalogu głównego.
4. **Settings > Pages > Build and deployment > Source > Deploy from a branch**; wybierz **main** oraz **/(root)**, **Save**.
5. Gra używa względnych ścieżek i działa także pod adresem repozytorium, np. `/PerfectPour/`. Dotyk, mysz lub **Space** nalewa; przyciski obsługujesz też klawiaturą.
6. Zapis jest lokalny dla przeglądarki i adresu strony. Wyczyszczenie danych witryny usuwa postęp. Wersja Web nie zawiera AdMob.

## Konfiguracja gry
- Android: `app/src/main/java/com/artur/perfectpour/GameEngine.kt` — LEVELS, FLOW, DROP_VOLUME, FALL_SPEED, target, tolerance, cupWidth, cupX, limit.
- Web: `engine.js` — te same reguły w osobnej implementacji. Ruch jest aktualizowany krokiem 1/120 sekundy.
- Nazwa Android: `res/values/strings.xml > app_name`.
- Ikona: `res/drawable/icon.xml`, `res/mipmap/ic_launcher.xml`, `res/mipmap-anydpi-v26/ic_launcher.xml`.
- Pakiet: zmień namespace i applicationId w `app/build.gradle.kts`, następnie w Android Studio **Refactor > Rename** pakietu `com.artur.perfectpour` we wszystkich plikach. Sprawdź nazwę aktywności w Manifest.
- Numer wydania: zwiększ versionCode; versionName to nazwa widoczna dla użytkownika.

## AdMob
Android korzysta z oficjalnych reklam TESTOWYCH: banner adaptacyjny tylko w menu/ustawieniach/wynikach, interstitial co czwartą zmianę rundy i nie częściej niż co 120 sekund, opcjonalny rewarded po przegranej. Rewarded zwiększa tolerancję kolejnej próby o 3,5 punktu procentowego. Nagroda jest przyznawana tylko z callbacku SDK. Zwykła ponowna próba zawsze jest bezpłatna. Błąd reklamy nie zatrzymuje gry.

App ID znajduje się w `res/values/strings.xml > admob_app_id`; trzy unit ID w `AdConfig.kt`. Testowych reklam nie należy mylić z reklamami generującymi przychód. Przed wydaniem zastąp je własnymi ID. UMP aktualizuje informacje o zgodzie przy uruchomieniu, wyświetla formularz gdy jest wymagany i blokuje żądania reklam bez canRequestAds. **Settings > Privacy Options** pojawia się, gdy UMP wymaga tego wejścia.

1. Utwórz konto na https://admob.google.com .
2. **Apps > Add app**: Android, wskaż czy opublikowana. Utwórz jednostki banner, interstitial oraz rewarded.
3. Skopiuj App ID (z `~`) do strings.xml, unit ID (z `/`) do AdConfig.kt.
4. W **Privacy & messaging** skonfiguruj i opublikuj właściwe komunikaty. Testowy App ID nie jest Twoją konfiguracją formularzy; pełny test UMP wymaga własnego App ID i urządzenia testowego.
5. Uzupełnij kontakt i URL polityki w PRIVACY_POLICY.md i w dialogu **Privacy Policy** w MainActivity.kt. Opublikuj politykę pod publicznym adresem i dodaj ten adres w Google Play Console.
6. Przetestuj formularze, zmianę zgody, brak sieci, brak reklam i reward callback na emulatorze i telefonie. Przed publikacją ustal grupę wiekową aplikacji i ustaw odpowiednią konfigurację reklam w AdMob/SDK.

### ADMOB — BEFORE PUBLISHING
- [ ] Create AdMob account / application
- [ ] Create Banner, Interstitial and Rewarded Ad Unit
- [ ] Replace test App ID and all test Unit IDs
- [ ] Configure privacy messages and verify consent
- [ ] Add Privacy Policy URL and developer contact
- [ ] Configure app-ads.txt if applicable
- [ ] Test release build and audience settings
- [ ] Never click your own production ads

## Google Play — podpisana wersja
1. **Build > Generate Signed App Bundle or APK > Android App Bundle**.
2. **Create new**: utwórz prywatny keystore i zapisz go poza folderem publikowanych źródeł. Zachowaj bezpiecznie plik i hasła.
3. Wybierz **release**, wygeneruj AAB i przetestuj przez test wewnętrzny Google Play.
4. Uzupełnij listing, deklaracje Data safety, reklamy, grupę docelową i politykę prywatności na podstawie rzeczywistego działania aplikacji/SDK.
5. Nie publikuj keystore, haseł, local.properties, danych kont ani prywatnych kluczy. Projekt nie zawiera klucza podpisującego.

## Wyniki weryfikacji
Zobacz `VERIFICATION_PL.md`. W tym środowisku nie skompilowano Androida: brak Android SDK i dostępu do pobrania Gradle. Nie traktuj źródeł jako zatwierdzonego wydania produkcyjnego. Wymagana jest kompilacja i test na urządzeniu.
