(defproject com.oursky/doorlock "1.0.0-SNAPSHOT"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.9.198"]
                 [org.clojure/core.async "0.2.385"]
                 [com.taoensso/timbre "4.7.0"]
                 ]
  :plugins [[lein-cljsbuild "1.1.3"]]
  :clean-targets ^{:protect false} ["dist"]
  :cljsbuild {:builds [{:source-paths ["src"]
                        :compiler {:main com.oursky.doorlock.core
                                   :output-dir "dist"
                                   :output-to "dist/index.js"
                                   ;:source-map "dist/index.js.map"
                                   :target :nodejs
                                   :optimizations :simple}}]})
