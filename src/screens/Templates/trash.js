  function hasAccessToOPtion(data, label) {
    // Iterate through the array
    for (let obj of data) {
      // Check if the current object has label "payment_page" and is_access is true
      if (obj.label === label && obj.is_access) {
        return true; // If found, return true
      }
    }
    return false; // If not found, return false
  }
 

  const menuHandling = (value) => {

    let find_general_questions_module = value.module_info.find(
      (module) =>
        module.module_actual_name == "general_questions" && module.is_access
    );

    const MENU_OPTIONS = [];
    if (userInfo.team_type !== "sub_team") {
      MENU_OPTIONS.push({
        label: "Edit Template Setting",
        icon: "akar-icons:edit",
        handleClick: (e) => {
          handleEdit(e);
        },
      });
      if (hasAccessToOPtion(value.page_options_access, "update_page_content")) {
        MENU_OPTIONS.push({
          label: "Update Content",
          icon: "akar-icons:edit",
          handleClick: handleUpdatePageContent,
        });
      }
    }
    MENU_OPTIONS.push({
      label: "Copy main URL",
      icon: "eva:eye-fill",
      handleClick: handleCopyURL,
    });
    if (value.type_of_page == "book_a_call_page") {
      MENU_OPTIONS.splice(5, 0, {
        label: "Copy Appointment URL",
        icon: "eva:eye-fill",
        handleClick: handleCopyAppointmentURL,
      });
    }
    if (userInfo.team_type !== "sub_team") {
      if (
        value.type_of_page == "book_a_call_page"
        // && find_general_questions_module
      ) {
        MENU_OPTIONS.splice(6, 0, {
          label: "Question Answers",
          icon: "eva:eye-fill",
          handleClick: handleQuestionAnswers,
        });
      }
      // child menu
      if (hasAccessToOPtion(value.page_options_access, "thanks_page")) {
        if (value.thanks_page) {
          let child_menu_options = [
            {
              label: "Edit Page Setting",
              icon: "akar-icons:edit",
              handleClick: (e) => {
                handleEditThanksPage(e);
              },
            },
            {
              label: "Update Page Content",
              icon: "akar-icons:edit",
              handleClick: handleUpdateThanksPageContent,
            },
          ];
          value.thanks_page?.module_info?.map((module) => {
            child_menu_options.push({
              label: module.module_label_text,
              icon: "akar-icons:edit",
              handleClick: () => {
                handleRedirect(module, value, "thanks_page");
              },
            });
          });
          MENU_OPTIONS.push({
            label: "Thanks Page",
            icon: "akar-icons:edit",
            child_options: child_menu_options,
          });
        }
      }
      if (hasAccessToOPtion(value.page_options_access, "payment_page")) {
        if (value.payment_page) {
          let child_menu_options = [
            {
              label: "Edit Page Setting",
              icon: "akar-icons:edit",
              handleClick: (e) => {
                handleEditPaymentPage(e);
              },
            },
            {
              label: "Update Page Content",
              icon: "akar-icons:edit",
              handleClick: handleUpdatePaymentPageContent,
            },
          ];
          value.payment_page?.module_info?.map((module) => {
            child_menu_options.push({
              label: module.module_label_text,
              icon: "akar-icons:edit",
              handleClick: () => {
                handleRedirect(module, value, "payment_page");
              },
            });
          });
          MENU_OPTIONS.push({
            label: "Payment Page",
            icon: "akar-icons:edit",
            child_options: child_menu_options,
          });
        }
      }
      // child menu end
      if (!value.is_template_data_imported) {
        MENU_OPTIONS.push({
          label: "Import Template Data",
          icon: "akar-icons:edit",
          handleClick: handleAgreeImportData,
        });
      }
      if (value.plan_count > 0) {
        MENU_OPTIONS.push({
          label: "Set Commisssion",
          icon: "akar-icons:edit",
          handleClick: handleSetCommission,
        });
      }
      value.module_info.map((module) => {
        if (module.is_access) {
          MENU_OPTIONS.push({
            label: module.module_label_text,
            icon: "akar-icons:edit",
            handleClick: () => {
              handleRedirect(module, value);
            },
          });
        }
      });
      MENU_OPTIONS.push({
        label: "Delete",
        icon: "ant-design:delete-twotone",
        handleClick: (e) => {
          handleDeletePages(e);
        },
      });
      const shouldInsert = value.page_options_access.some(
        (obj) => obj.is_access === true
      );
      if (shouldInsert) {
        const index = 2;
        MENU_OPTIONS.splice(
          index,
          0,
          ...value.page_options_access.map((obj) => {
            console.log(obj, "page_options_access");
            if (
              obj.is_access === true &&
              obj.label == "social_sharing_setting"
            ) {
              return {
                label: obj.name,
                icon: "akar-icons:edit",
                handleClick: handleSocialSharing,
              };
            }
          })
        );
      }
    }
    let newArray = MENU_OPTIONS.filter((obj) => obj != undefined);
    return newArray;
  };

