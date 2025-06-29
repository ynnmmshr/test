// Level 2: 応用問題（100問）
export const level2Questions = [
    {
        id: 1,
        question: "0.1 mol/Lの塩酸水溶液のpHはいくらか。ただし、log₁₀2 = 0.30とする。",
        options: ["1.0", "1.3", "2.0", "2.3"],
        correct: 0,
        explanation: "pH = -log₁₀[H⁺] = -log₁₀(0.1) = -log₁₀(10⁻¹) = 1.0"
    },
    {
        id: 2,
        question: "0.01 mol/Lの水酸化ナトリウム水溶液のpHはいくらか。",
        options: ["10", "11", "12", "13"],
        correct: 2,
        explanation: "pOH = -log₁₀[OH⁻] = -log₁₀(0.01) = 2、pH = 14 - pOH = 12"
    },
    {
        id: 3,
        question: "0.1 mol/Lの酢酸水溶液のpHはいくらか。ただし、酢酸の電離度は0.01とする。",
        options: ["2.0", "3.0", "4.0", "5.0"],
        correct: 1,
        explanation: "[H⁺] = cα = 0.1 × 0.01 = 0.001 mol/L、pH = -log₁₀(0.001) = 3.0"
    },
    {
        id: 4,
        question: "0.1 mol/Lのアンモニア水溶液のpHはいくらか。ただし、アンモニアの電離度は0.01とする。",
        options: ["9", "10", "11", "12"],
        correct: 2,
        explanation: "[OH⁻] = cα = 0.1 × 0.01 = 0.001 mol/L、pOH = 3、pH = 14 - 3 = 11"
    },
    {
        id: 5,
        question: "0.1 mol/Lの塩酸と0.1 mol/Lの水酸化ナトリウムを等量混合した溶液のpHはいくらか。",
        options: ["1", "7", "13", "14"],
        correct: 1,
        explanation: "強酸と強塩基の等量混合により中和が起こり、pH = 7（中性）となる"
    },
    {
        id: 6,
        question: "0.1 mol/Lの酢酸と0.1 mol/Lの水酸化ナトリウムを等量混合した溶液のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "弱酸と強塩基の等量混合により、酢酸ナトリウムの塩が生成され、加水分解により塩基性となる"
    },
    {
        id: 7,
        question: "0.1 mol/Lの塩酸と0.1 mol/Lのアンモニアを等量混合した溶液のpHはいくらか。",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "強酸と弱塩基の等量混合により、塩化アンモニウムの塩が生成され、加水分解により酸性となる"
    },
    {
        id: 8,
        question: "0.1 mol/Lの酢酸と0.1 mol/Lのアンモニアを等量混合した溶液のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 2,
        explanation: "弱酸と弱塩基の等量混合により、酢酸アンモニウムの塩が生成され、ほぼ中性となる"
    },
    {
        id: 9,
        question: "0.1 mol/Lの塩酸に0.1 mol/Lの水酸化ナトリウムを10 mL加えたときのpHはいくらか。",
        options: ["1", "2", "3", "4"],
        correct: 1,
        explanation: "塩酸が過剰となり、残りのH⁺濃度からpHを計算する"
    },
    {
        id: 10,
        question: "0.1 mol/Lの水酸化ナトリウムに0.1 mol/Lの塩酸を10 mL加えたときのpHはいくらか。",
        options: ["10", "11", "12", "13"],
        correct: 2,
        explanation: "水酸化ナトリウムが過剰となり、残りのOH⁻濃度からpHを計算する"
    },
    {
        id: 11,
        question: "0.1 mol/Lの酢酸水溶液に0.1 mol/Lの水酸化ナトリウムを10 mL加えたときのpHはいくらか。",
        options: ["4.7", "5.7", "6.7", "7.7"],
        correct: 0,
        explanation: "緩衝溶液が形成され、pH = pKa + log([A⁻]/[HA])の式で計算する"
    },
    {
        id: 12,
        question: "0.1 mol/Lのアンモニア水溶液に0.1 mol/Lの塩酸を10 mL加えたときのpHはいくらか。",
        options: ["4.7", "5.7", "6.7", "7.7"],
        correct: 2,
        explanation: "緩衝溶液が形成され、pH = pKa + log([A⁻]/[HA])の式で計算する"
    },
    {
        id: 13,
        question: "0.1 mol/Lの酢酸水溶液のpHはいくらか。ただし、酢酸のKa = 1.8 × 10⁻⁵とする。",
        options: ["2.9", "3.9", "4.9", "5.9"],
        correct: 0,
        explanation: "[H⁺] = √(Ka × c) = √(1.8 × 10⁻⁵ × 0.1) = 1.34 × 10⁻³、pH = 2.9"
    },
    {
        id: 14,
        question: "0.1 mol/Lのアンモニア水溶液のpHはいくらか。ただし、アンモニアのKb = 1.8 × 10⁻⁵とする。",
        options: ["9.1", "10.1", "11.1", "12.1"],
        correct: 2,
        explanation: "[OH⁻] = √(Kb × c) = √(1.8 × 10⁻⁵ × 0.1) = 1.34 × 10⁻³、pOH = 2.9、pH = 11.1"
    },
    {
        id: 15,
        question: "0.1 mol/Lの酢酸ナトリウム水溶液のpHはいくらか。",
        options: ["7.0", "8.0", "9.0", "10.0"],
        correct: 2,
        explanation: "弱酸の塩の加水分解により塩基性となり、pH > 7となる"
    },
    {
        id: 16,
        question: "0.1 mol/Lの塩化アンモニウム水溶液のpHはいくらか。",
        options: ["4.0", "5.0", "6.0", "7.0"],
        correct: 1,
        explanation: "弱塩基の塩の加水分解により酸性となり、pH < 7となる"
    },
    {
        id: 17,
        question: "0.1 mol/Lの酢酸と0.1 mol/Lの酢酸ナトリウムを等量混合した緩衝溶液のpHはいくらか。",
        options: ["4.7", "5.7", "6.7", "7.7"],
        correct: 0,
        explanation: "pH = pKa + log([A⁻]/[HA]) = 4.7 + log(1) = 4.7"
    },
    {
        id: 18,
        question: "0.1 mol/Lのアンモニアと0.1 mol/Lの塩化アンモニウムを等量混合した緩衝溶液のpHはいくらか。",
        options: ["7.3", "8.3", "9.3", "10.3"],
        correct: 2,
        explanation: "pH = pKa + log([A⁻]/[HA]) = 9.3 + log(1) = 9.3"
    },
    {
        id: 19,
        question: "0.1 mol/Lの酢酸水溶液に0.1 mol/Lの水酸化ナトリウムを5 mL加えたときのpHはいくらか。",
        options: ["3.7", "4.7", "5.7", "6.7"],
        correct: 1,
        explanation: "緩衝溶液が形成され、pH = pKa + log([A⁻]/[HA])で計算する"
    },
    {
        id: 20,
        question: "0.1 mol/Lのアンモニア水溶液に0.1 mol/Lの塩酸を5 mL加えたときのpHはいくらか。",
        options: ["7.3", "8.3", "9.3", "10.3"],
        correct: 2,
        explanation: "緩衝溶液が形成され、pH = pKa + log([A⁻]/[HA])で計算する"
    },
    {
        id: 21,
        question: "0.1 mol/Lの塩酸の滴定曲線で、当量点のpHはいくらか。",
        options: ["1", "7", "13", "14"],
        correct: 1,
        explanation: "強酸と強塩基の滴定では、当量点でpH = 7（中性）となる"
    },
    {
        id: 22,
        question: "0.1 mol/Lの酢酸の滴定曲線で、当量点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "弱酸と強塩基の滴定では、当量点で塩基性となる"
    },
    {
        id: 23,
        question: "0.1 mol/Lのアンモニアの滴定曲線で、当量点のpHはいくらか。",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "弱塩基と強酸の滴定では、当量点で酸性となる"
    },
    {
        id: 24,
        question: "0.1 mol/Lの塩酸の滴定で、中和点のpHはいくらか。",
        options: ["1", "7", "13", "14"],
        correct: 1,
        explanation: "中和点ではpH = 7（中性）となる"
    },
    {
        id: 25,
        question: "0.1 mol/Lの酢酸の滴定で、中和点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "弱酸の中和では、中和点で塩基性となる"
    },
    {
        id: 26,
        question: "0.1 mol/Lのアンモニアの滴定で、中和点のpHはいくらか。",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "弱塩基の中和では、中和点で酸性となる"
    },
    {
        id: 27,
        question: "0.1 mol/Lの塩酸の滴定で、半中和点のpHはいくらか。",
        options: ["1", "2", "3", "4"],
        correct: 1,
        explanation: "半中和点では、残りの酸の濃度からpHを計算する"
    },
    {
        id: 28,
        question: "0.1 mol/Lの酢酸の滴定で、半中和点のpHはいくらか。",
        options: ["3.7", "4.7", "5.7", "6.7"],
        correct: 1,
        explanation: "半中和点では、pH = pKa = 4.7となる"
    },
    {
        id: 29,
        question: "0.1 mol/Lのアンモニアの滴定で、半中和点のpHはいくらか。",
        options: ["7.3", "8.3", "9.3", "10.3"],
        correct: 2,
        explanation: "半中和点では、pH = pKa = 9.3となる"
    },
    {
        id: 30,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてフェノールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "フェノールフタレインの変色域はpH 8.3-10.0である"
    },
    {
        id: 31,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてメチルオレンジを使用した場合、変色点のpHはいくらか。",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "メチルオレンジの変色域はpH 3.1-4.4である"
    },
    {
        id: 32,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてブロモチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 1,
        explanation: "ブロモチモールブルーの変色域はpH 6.0-7.6である"
    },
    {
        id: 33,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてメチルレッドを使用した場合、変色点のpHはいくらか。",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "メチルレッドの変色域はpH 4.4-6.2である"
    },
    {
        id: 34,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "チモールブルーの変色域はpH 8.0-9.6である"
    },
    {
        id: 35,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてクレゾールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "クレゾールレッドの変色域はpH 7.2-8.8である"
    },
    {
        id: 36,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてアリザリンイエローを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "アリザリンイエローの変色域はpH 10.1-12.0である"
    },
    {
        id: 37,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 38,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルバイオレットを使用した場合、変色点のpHはいくらか。",
        options: ["0", "1", "2", "3"],
        correct: 1,
        explanation: "メチルバイオレットの変色域はpH 0.0-1.6である"
    },
    {
        id: 39,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモフェノールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "ブロモフェノールブルーの変色域はpH 3.0-4.6である"
    },
    {
        id: 40,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "フェノールレッドの変色域はpH 6.8-8.4である"
    },
    {
        id: 41,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 42,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてメチルオレンジを使用した場合、変色点のpHはいくらか。",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "メチルオレンジの変色域はpH 3.1-4.4である"
    },
    {
        id: 43,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "フェノールフタレインの変色域はpH 8.3-10.0である"
    },
    {
        id: 44,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルレッドを使用した場合、変色点のpHはいくらか。",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "メチルレッドの変色域はpH 4.4-6.2である"
    },
    {
        id: 45,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 1,
        explanation: "ブロモチモールブルーの変色域はpH 6.0-7.6である"
    },
    {
        id: 46,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "チモールブルーの変色域はpH 8.0-9.6である"
    },
    {
        id: 47,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてクレゾールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "クレゾールレッドの変色域はpH 7.2-8.8である"
    },
    {
        id: 48,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてアリザリンイエローを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "アリザリンイエローの変色域はpH 10.1-12.0である"
    },
    {
        id: 49,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 50,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルバイオレットを使用した場合、変色点のpHはいくらか。",
        options: ["0", "1", "2", "3"],
        correct: 1,
        explanation: "メチルバイオレットの変色域はpH 0.0-1.6である"
    },
    {
        id: 51,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモフェノールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["2", "3", "4", "5"],
        correct: 1,
        explanation: "ブロモフェノールブルーの変色域はpH 3.0-4.6である"
    },
    {
        id: 52,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 2,
        explanation: "フェノールレッドの変色域はpH 6.8-8.4である"
    },
    {
        id: 53,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 54,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてメチルオレンジを使用した場合、変色点のpHはいくらか。",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "メチルオレンジの変色域はpH 3.1-4.4である"
    },
    {
        id: 55,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "フェノールフタレインの変色域はpH 8.3-10.0である"
    },
    {
        id: 56,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルレッドを使用した場合、変色点のpHはいくらか。",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "メチルレッドの変色域はpH 4.4-6.2である"
    },
    {
        id: 57,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 1,
        explanation: "ブロモチモールブルーの変色域はpH 6.0-7.6である"
    },
    {
        id: 58,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "チモールブルーの変色域はpH 8.0-9.6である"
    },
    {
        id: 59,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてクレゾールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "クレゾールレッドの変色域はpH 7.2-8.8である"
    },
    {
        id: 60,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてアリザリンイエローを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "アリザリンイエローの変色域はpH 10.1-12.0である"
    },
    {
        id: 61,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 62,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルバイオレットを使用した場合、変色点のpHはいくらか。",
        options: ["0", "1", "2", "3"],
        correct: 1,
        explanation: "メチルバイオレットの変色域はpH 0.0-1.6である"
    },
    {
        id: 63,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモフェノールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["2", "3", "4", "5"],
        correct: 1,
        explanation: "ブロモフェノールブルーの変色域はpH 3.0-4.6である"
    },
    {
        id: 64,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 2,
        explanation: "フェノールレッドの変色域はpH 6.8-8.4である"
    },
    {
        id: 65,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 66,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてメチルオレンジを使用した場合、変色点のpHはいくらか。",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "メチルオレンジの変色域はpH 3.1-4.4である"
    },
    {
        id: 67,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "フェノールフタレインの変色域はpH 8.3-10.0である"
    },
    {
        id: 68,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルレッドを使用した場合、変色点のpHはいくらか。",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "メチルレッドの変色域はpH 4.4-6.2である"
    },
    {
        id: 69,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 1,
        explanation: "ブロモチモールブルーの変色域はpH 6.0-7.6である"
    },
    {
        id: 70,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "チモールブルーの変色域はpH 8.0-9.6である"
    },
    {
        id: 71,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてクレゾールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "クレゾールレッドの変色域はpH 7.2-8.8である"
    },
    {
        id: 72,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてアリザリンイエローを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "アリザリンイエローの変色域はpH 10.1-12.0である"
    },
    {
        id: 73,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 74,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルバイオレットを使用した場合、変色点のpHはいくらか。",
        options: ["0", "1", "2", "3"],
        correct: 1,
        explanation: "メチルバイオレットの変色域はpH 0.0-1.6である"
    },
    {
        id: 75,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモフェノールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["2", "3", "4", "5"],
        correct: 1,
        explanation: "ブロモフェノールブルーの変色域はpH 3.0-4.6である"
    },
    {
        id: 76,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 2,
        explanation: "フェノールレッドの変色域はpH 6.8-8.4である"
    },
    {
        id: 77,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 78,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてメチルオレンジを使用した場合、変色点のpHはいくらか。",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "メチルオレンジの変色域はpH 3.1-4.4である"
    },
    {
        id: 79,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "フェノールフタレインの変色域はpH 8.3-10.0である"
    },
    {
        id: 80,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルレッドを使用した場合、変色点のpHはいくらか。",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "メチルレッドの変色域はpH 4.4-6.2である"
    },
    {
        id: 81,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 1,
        explanation: "ブロモチモールブルーの変色域はpH 6.0-7.6である"
    },
    {
        id: 82,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "チモールブルーの変色域はpH 8.0-9.6である"
    },
    {
        id: 83,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてクレゾールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "クレゾールレッドの変色域はpH 7.2-8.8である"
    },
    {
        id: 84,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてアリザリンイエローを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "アリザリンイエローの変色域はpH 10.1-12.0である"
    },
    {
        id: 85,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 86,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルバイオレットを使用した場合、変色点のpHはいくらか。",
        options: ["0", "1", "2", "3"],
        correct: 1,
        explanation: "メチルバイオレットの変色域はpH 0.0-1.6である"
    },
    {
        id: 87,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモフェノールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["2", "3", "4", "5"],
        correct: 1,
        explanation: "ブロモフェノールブルーの変色域はpH 3.0-4.6である"
    },
    {
        id: 88,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 2,
        explanation: "フェノールレッドの変色域はpH 6.8-8.4である"
    },
    {
        id: 89,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 90,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてメチルオレンジを使用した場合、変色点のpHはいくらか。",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "メチルオレンジの変色域はpH 3.1-4.4である"
    },
    {
        id: 91,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "フェノールフタレインの変色域はpH 8.3-10.0である"
    },
    {
        id: 92,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルレッドを使用した場合、変色点のpHはいくらか。",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "メチルレッドの変色域はpH 4.4-6.2である"
    },
    {
        id: 93,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 1,
        explanation: "ブロモチモールブルーの変色域はpH 6.0-7.6である"
    },
    {
        id: 94,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "チモールブルーの変色域はpH 8.0-9.6である"
    },
    {
        id: 95,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてクレゾールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "クレゾールレッドの変色域はpH 7.2-8.8である"
    },
    {
        id: 96,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてアリザリンイエローを使用した場合、変色点のpHはいくらか。",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "アリザリンイエローの変色域はpH 10.1-12.0である"
    },
    {
        id: 97,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてチモールフタレインを使用した場合、変色点のpHはいくらか。",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "チモールフタレインの変色域はpH 9.3-10.5である"
    },
    {
        id: 98,
        question: "0.1 mol/Lのアンモニアの滴定で、指示薬としてメチルバイオレットを使用した場合、変色点のpHはいくらか。",
        options: ["0", "1", "2", "3"],
        correct: 1,
        explanation: "メチルバイオレットの変色域はpH 0.0-1.6である"
    },
    {
        id: 99,
        question: "0.1 mol/Lの塩酸の滴定で、指示薬としてブロモフェノールブルーを使用した場合、変色点のpHはいくらか。",
        options: ["2", "3", "4", "5"],
        correct: 1,
        explanation: "ブロモフェノールブルーの変色域はpH 3.0-4.6である"
    },
    {
        id: 100,
        question: "0.1 mol/Lの酢酸の滴定で、指示薬としてフェノールレッドを使用した場合、変色点のpHはいくらか。",
        options: ["5", "6", "7", "8"],
        correct: 2,
        explanation: "フェノールレッドの変色域はpH 6.8-8.4である"
    }
]; 