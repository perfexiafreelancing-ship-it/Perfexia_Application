import 'package:flutter/material.dart';

import 'auth_screen.dart';

void main() {
  runApp(const PerfexiaApp());
}

class PerfexiaApp extends StatelessWidget {
  const PerfexiaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Perfexia',
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        fontFamily: 'Poppins',
      ),
      home: const SplashScreen(),
    );
  }
}

class PerfexiaColors {
  static const primary = Color(0xFF3B2A7A);
  static const secondary = Color(0xFF8B5CF6);
  static const accent = Color(0xFF2DE2D2);
  static const background = Color(0xFF120F2E);
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  int _currentIndex = 0;

  late final PageController _pageController;
  late final AnimationController _progressController;
  late final Animation<double> _progressAnimation;

  final List<String> images = [
    'assets/images/slide1.png',
    'assets/images/slide2.png',
    'assets/images/slide3.png',
    'assets/images/slide4.png',
  ];

  @override
  void initState() {
    super.initState();

    _pageController = PageController(initialPage: _currentIndex);

    _progressController =
        AnimationController(vsync: this, duration: const Duration(seconds: 3));

    _progressAnimation =
    Tween<double>(begin: 0, end: 1).animate(_progressController)
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          _nextImage();
        }
      });

    _progressController.forward();
  }

  void _nextImage() {
    setState(() {
      _currentIndex = (_currentIndex + 1) % images.length;
      _pageController.animateToPage(
        _currentIndex,
        duration: const Duration(milliseconds: 800),
        curve: Curves.easeInOut,
      );
      _progressController.reset();
      _progressController.forward();
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final bool isMobile = size.width < 700;

    return Scaffold(
      backgroundColor: PerfexiaColors.background,
      body: Column(
        children: [
          Expanded(
            flex: 6,
            child: Stack(
              alignment: Alignment.center,
              children: [
                PageView.builder(
                  controller: _pageController,
                  scrollDirection: isMobile ? Axis.vertical : Axis.horizontal,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: images.length,
                  itemBuilder: (context, index) {
                    final isActive = index == _currentIndex;
                    return AnimatedOpacity(
                      duration: const Duration(seconds: 1),
                      opacity: isActive ? 1 : 0,
                      curve: Curves.easeInOut,
                      child: Image.asset(
                        images[index],
                        fit: BoxFit.contain,
                        width: double.infinity,
                        height: double.infinity,
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          Expanded(
            flex: 4,
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: isMobile ? 24 : 80,
                vertical: 30,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Perfexia',
                    style: TextStyle(
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Where Perfection Meets Excellence',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 30),

                  AnimatedBuilder(
                    animation: _progressAnimation,
                    builder: (context, child) {
                      return LinearProgressIndicator(
                        value: (_currentIndex + _progressAnimation.value) /
                            images.length,
                        color: PerfexiaColors.accent,
                        backgroundColor: Colors.white12,
                        minHeight: 6,
                      );
                    },
                  ),

                  const SizedBox(height: 30),

                  SizedBox(
                    width: isMobile ? double.infinity : 260,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: PerfexiaColors.accent,
                        foregroundColor: Colors.black,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const AuthScreen()),
                        );
                      },
                      child: const Text(
                        'Explore Perfexia',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}


