(defproject com.oursky/doorlock "1.0.0-SNAPSHOT"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/core.async "0.2.385"]
                 [com.taoensso/timbre "4.7.0"]
                 [clj-gpio "0.2.0"]
                 ]
  :profiles {:uberjar {:aot :all}}
  :main com.oursky.doorlock.core)