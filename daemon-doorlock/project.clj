(defproject com.oursky/doorlock "1.0.0"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/core.async "0.2.385"]
                 [com.taoensso/timbre "4.7.0"]
                 [org.clojure/data.json "0.2.6"]
                 [http-kit "2.2.0"]
                 ]
  :aot :all
  :main com.oursky.doorlock.core)
