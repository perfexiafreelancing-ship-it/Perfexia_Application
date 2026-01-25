import 'dart:math';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'colors/PerfixiaColors.dart';
import 'home.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen>
    with SingleTickerProviderStateMixin {
  bool isLogin = true;
  bool obscurePassword = true;
  bool consent = false;

  late AnimationController _controller;
  late Animation<double> _flip;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 650),
    );
    _flip = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOutExpo,
    );
  }

  void toggleAuth() async {
    if (_controller.isAnimating) return;
    await _controller.forward();
    setState(() => isLogin = !isLogin);
    _controller.reset();
  }

  void _goToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const HomeScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isDesktop = width >= 900;

    return Scaffold(
      backgroundColor: PerfexiaColors.background,
      body: SafeArea(
        child: isDesktop
            ? Row(
          children: [
            Expanded(child: _scrollable(_testimonials())),
            Expanded(child: _scrollable(_authAnimatedCard())),
          ],
        )
            : _scrollable(_authAnimatedCard()),
      ),
    );
  }

  /// ------------------ SCROLL FIX ------------------
  Widget _scrollable(Widget child) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight),
            child: child,
          ),
        );
      },
    );
  }

  /// ------------------ AUTH CARD ------------------
  Widget _authAnimatedCard() {
    return Center(
      child: AnimatedBuilder(
        animation: _flip,
        builder: (context, child) {
          final angle = _flip.value * pi / 2;
          final opacity = (1 - _flip.value * 0.2).clamp(0.85, 1.0);

          return Opacity(
            opacity: opacity,
            child: Transform(
              alignment: Alignment.center,
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.0008)
                ..rotateY(angle),
              child: _authCard(isLogin ? _login() : _signup()),
            ),
          );
        },
      ),
    );
  }

  Widget _authCard(Widget content) {
    return Container(
      width: 420,
      margin: const EdgeInsets.all(24),
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: LinearGradient(
          colors: [PerfexiaColors.secondary, PerfexiaColors.primary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: content,
    );
  }

  /// ------------------ LOGIN ------------------
  Widget _login() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _brand("Login to Continue"),
        const SizedBox(height: 20),
        _quote(),
        const SizedBox(height: 26),
        _input("Email", Icons.email_outlined),
        const SizedBox(height: 16),
        _password(),
        const SizedBox(height: 26),
        _button("Login"),
        _skip(),
        const SizedBox(height: 6),
        Center(
          child: TextButton(
            onPressed: toggleAuth,
            child: const Text(
              "Don't have an account? Sign Up",
              style: TextStyle(color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  /// ------------------ SIGNUP ------------------
  Widget _signup() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _brand("Create Account"),
        const SizedBox(height: 20),
        _input("Full Name", Icons.person_outline),
        const SizedBox(height: 14),
        _input("Email", Icons.email_outlined),
        const SizedBox(height: 14),
        _input("Mobile Number", Icons.phone_outlined),
        const SizedBox(height: 14),
        _password(),
        const SizedBox(height: 14),
        _consent(),
        const SizedBox(height: 22),
        _button("Sign Up"),
        _skip(),
        const SizedBox(height: 6),
        Center(
          child: TextButton(
            onPressed: toggleAuth,
            child: const Text(
              "Already have an account? Login",
              style: TextStyle(color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  /// ------------------ UI PARTS ------------------
  Widget _brand(String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Perfexia",
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 6),
        Text(subtitle, style: const TextStyle(color: Colors.white70)),
      ],
    );
  }

  Widget _input(String hint, IconData icon) {
    return TextField(
      style: const TextStyle(color: Colors.white),
      decoration: _decor(hint, icon),
    );
  }

  Widget _password() {
    return TextField(
      obscureText: obscurePassword,
      style: const TextStyle(color: Colors.white),
      decoration: _decor(
        "Password",
        Icons.lock_outline,
        suffix: IconButton(
          icon: Icon(
            obscurePassword ? Icons.visibility_off : Icons.visibility,
            color: Colors.white70,
          ),
          onPressed: () =>
              setState(() => obscurePassword = !obscurePassword),
        ),
      ),
    );
  }

  InputDecoration _decor(String hint, IconData icon, {Widget? suffix}) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Colors.white60),
      prefixIcon: Icon(icon, color: Colors.white70),
      suffixIcon: suffix,
      filled: true,
      fillColor: Colors.black.withOpacity(0.25),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide.none,
      ),
    );
  }

  Widget _button(String text) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: PerfexiaColors.accent,
          foregroundColor: Colors.black,
          shape:
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
        onPressed: () {},
        child: Text(
          text,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
    );
  }

  Widget _skip() {
    return Align(
      alignment: Alignment.centerRight,
      child: TextButton(
        onPressed: _goToHome,
        child: const Text(
          "Skip & Proceed",
          style: TextStyle(
            fontSize: 13,
            color: Colors.white70,
            decoration: TextDecoration.underline,
          ),
        ),
      ),
    );
  }

  Widget _consent() {
    return Row(
      children: [
        Checkbox(
          value: consent,
          activeColor: PerfexiaColors.accent,
          onChanged: (v) => setState(() => consent = v ?? false),
        ),
        const Expanded(
          child: Text(
            "I agree to the Terms & Privacy Policy",
            style: TextStyle(color: Colors.white70),
          ),
        ),
      ],
    );
  }

  Widget _quote() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.12),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.white.withOpacity(0.25)),
          ),
          child: const Text(
            "Great products are built when vision meets flawless execution.",
            style: TextStyle(color: Colors.white, height: 1.5),
          ),
        ),
      ),
    );
  }

  /// ------------------ TESTIMONIALS ------------------
  Widget _testimonials() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 80, vertical: 40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Trusted by Global Teams",
            style: TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            "We craft scalable digital experiences for ambitious brands.",
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
          const SizedBox(height: 40),
          _testimonialCard(
            "Perfexia transformed our idea into a world-class product.",
            "Startup Founder",
          ),
          const SizedBox(height: 24),
          _testimonialCard(
            "Clean architecture, stunning UI, professional delivery.",
            "Product Manager",
          ),
        ],
      ),
    );
  }

  Widget _testimonialCard(String text, String author) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.12),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withOpacity(0.25)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.format_quote, color: Colors.white70),
              const SizedBox(height: 10),
              Text(
                text,
                style: const TextStyle(color: Colors.white, height: 1.5),
              ),
              const SizedBox(height: 12),
              Text(author,
                  style: const TextStyle(color: Colors.white70)),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}


