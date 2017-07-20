1. Add this lines into `composer.json`:


```
    "repositories": [
        {
            "type": "path",
            "url": "workbench/*/"
        }
    ],
```


2. Add this line into `require` in `composer.json`:


```
"czbix/flarum-ext-registration-exam": "*@dev"

```


3. Put this folder into `workbench` dir.

4. Run `composer update`.
