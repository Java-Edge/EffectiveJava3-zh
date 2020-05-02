// .vuepress/config.js
module.exports = {
  title: "《Effective Java 第三版》中文翻译",
  base: "/doc-ej3/",
  themeConfig: {
    repo: "gdut-yy/EffectiveJava3-zh",
    repoLabel: "Github",
    docsRepo: "gdut-yy/EffectiveJava3-zh",
    docsBranch: "master/docs",
    editLinks: true,
    editLinkText: "帮助我们改善此页面！",
    lastUpdated: "Last Updated",
    sidebarDepth: 2,
    nav: [],
    sidebar: {
      "/": [
        "",
        "ch2.md",
        "ch3.md",
        "ch4.md",
        "ch5.md",
        "ch6.md",
        "ch7.md",
        "ch8.md",
        "ch9.md",
        "ch10.md",
        "ch11.md",
        "ch12.md",
      ],
    },
  },
};
